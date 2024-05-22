import { request } from "@elumixor/angular-server";
import { all, nonNull } from "@elumixor/frontils";
import type { IBoardData, PropertyResponse, PropertyType, PropertyValue, TaskResponse, ToIds } from "@shared";
import { eq, and } from "drizzle-orm";
import { chain } from "lodash";
import { database, tags, tasks, values, properties } from "./db";

export class Api {
    private readonly db = database().db; // when to close the connection?

    @request("property/all")
    async getProperties(): Promise<PropertyResponse[]> {
        // Select base properties
        const properties = await this.db.query.properties.findMany();

        // Add parameters if needed (i.e. for tags)
        return await all(
            ...properties.map(async (entry) => {
                let parameters;

                if (entry.type === "tag") {
                    const values = await this.db
                        .select({ id: tags.id, label: tags.label, color: tags.color })
                        .from(tags)
                        .where(eq(tags.propertyId, entry.id));

                    parameters = { multiple: entry.multiple, values: chain(values).keyBy("id").value() };
                }

                return { id: entry.id, name: entry.name, type: entry.type, parameters };
            }),
        );
    }

    @request("property/update")
    async updateProperty({ id, name, type, parameters }: PropertyResponse) {
        await this.db.transaction(async (tx) => {
            await tx.update(properties).set({ name, type }).where(eq(properties.id, id));

            if (type === "tag") {
                await tx.delete(tags).where(eq(tags.propertyId, id));
                if (parameters?.values)
                    await tx.insert(tags).values(
                        Object.values(parameters.values).map(({ label, color }) => ({
                            label,
                            color,
                            propertyId: id,
                        })),
                    );
            }
        });
    }

    @request("property/new")
    async addProperty({ name, type, parameters }: PropertyResponse) {
        await this.db.transaction(async (tx) => {
            const [{ id }] = await tx.insert(properties).values({ name, type }).returning({ id: properties.id });

            if (type === "tag") {
                await tx.insert(tags).values(
                    Object.values(parameters!.values).map(({ label, color }) => ({
                        label,
                        color,
                        propertyId: id,
                    })),
                );
            }
        });
    }

    @request("property/delete")
    async deleteProperty({ id }: { id: number }) {
        await this.db.transaction(async (tx) => {
            await tx.delete(values).where(eq(values.propertyId, id));
            await tx.delete(tags).where(eq(tags.propertyId, id));
            await tx.delete(properties).where(eq(properties.id, id));
        });
    }

    @request("task/all")
    async getTasks(): Promise<TaskResponse[]> {
        return this.db.transaction(async (tx) => {
            const des = await tx.query.properties.findMany({ columns: { id: true, type: true } });

            const result = await tx
                .select({
                    task: tasks.id,
                    propertyId: values.propertyId,
                    text: values.text,
                    relation: values.relation,
                    tag: values.tag,
                })
                .from(tasks)
                .leftJoin(values, eq(tasks.id, values.taskId));

            return chain(result)
                .groupBy("task")
                .map((values, taskId) => ({
                    id: Number(taskId),
                    properties: chain(des)
                        .map(({ id, type }) => {
                            const v = values
                                .filter(({ propertyId }) => propertyId === id)
                                .map((v) => v[type] ?? this.defaultFor(type));
                            const res = type === "text" ? v.first : v;
                            return [id, res];
                        })
                        .fromPairs()
                        .value(),
                }))
                .value();
        });
    }

    @request("task/new")
    async addTask({ properties }: { properties?: { id: number; value: ToIds<PropertyValue> }[] }) {
        const [{ id }] = await this.db.insert(tasks).values({}).returning({ id: tasks.id });
        if (properties?.nonEmpty) await this.updateTasks({ tasks: [{ id, properties }] });
        return { id };
    }

    @request("task/update")
    async updateTasks({
        tasks: tasksValue,
    }: {
        tasks: { id: number; properties: { id: number; value: ToIds<PropertyValue> }[] }[];
    }) {
        // Firstly, remove all values with this id and property
        await this.db.transaction(async (tx) => {
            const deletePromises = tasksValue.flatMap(({ id: taskId, properties }) =>
                properties.map(({ id: propertyId }) =>
                    tx.delete(values).where(and(eq(values.taskId, taskId), eq(values.propertyId, propertyId))),
                ),
            );

            await all(...deletePromises);

            const properties = await tx.query.properties.findMany({ columns: { id: true, type: true } });
            const propertyMap = chain(properties).keyBy("id").value();

            const plainValues = tasksValue.flatMap(({ id: taskId, properties }) =>
                properties
                    .map(({ id: propertyId, value }) => {
                        // We need to flatten arrays here
                        if (Array.isArray(value)) {
                            return value.map((v) => ({
                                taskId,
                                propertyId,
                                [propertyMap[propertyId].type]: v,
                            }));
                        }

                        return {
                            taskId,
                            propertyId,
                            [propertyMap[propertyId].type]: value,
                        };
                    })
                    .flat(),
            );

            await tx.insert(values).values(plainValues);
        });
    }

    @request("task/delete")
    async deleteTask({ id }: { id: number }) {
        const { parentsPropertyId } = await this.getBoardData();

        console.log(
            await this.db
                .select({ taskId: tasks.id, parentId: values.relation })
                .from(values)
                .innerJoin(tasks, eq(tasks.id, values.taskId))
                .where(eq(values.propertyId, parentsPropertyId)),
        );

        // Select, all the tasks and their parents
        const childrenIds = chain(
            await this.db
                .select({ taskId: tasks.id, parentId: values.relation })
                .from(tasks)
                .innerJoin(values, eq(tasks.id, values.taskId))
                .where(eq(values.propertyId, parentsPropertyId)),
        )
            .groupBy((v) => v.taskId)
            .filter((v) => {
                console.log("filtering", v);
                return v.some(({ parentId }) => parentId === id);
            })
            .keys()
            .map((v) => ({ id: Number(v) }))
            .value();

        console.log("children", childrenIds);

        // Remove this task from all the parents
        await this.db.transaction(async (tx) => {
            await tx.delete(values).where(eq(values.relation, id));
            await tx.delete(values).where(eq(values.taskId, id));
            await tx.delete(tasks).where(eq(tasks.id, id));
        });

        // Remove all the children of this task where it's the only parent
        for (const { id } of childrenIds) await this.deleteTask({ id });
    }

    @request("board")
    async getBoardData(): Promise<IBoardData> {
        return nonNull(await this.db.query.boards.findFirst());
    }

    private defaultFor(type: PropertyType) {
        switch (type) {
            case "text":
                return "";
            case "tag":
            case "relation":
                return [];
            default:
                return undefined;
        }
    }
}

export type Request<T extends keyof Api> = Parameters<Api[T]>[0];
