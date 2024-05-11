import { request } from "@elumixor/angular-server";
import { all, nonNull } from "@elumixor/frontils";
import type { IBoardData, IPropertyDescriptor, IPropertyType, IPropertyValue, ITaskResponse } from "@shared";
import { eq } from "drizzle-orm";
import { database, tags, values, tasks } from "./db";
import { chain } from "lodash";

export class Api {
    private readonly db = database().db; // when to close the connection?

    @request("descriptors")
    async getDescriptors(): Promise<IPropertyDescriptor[]> {
        // Select base properties
        const descriptors = await this.db.query.descriptors.findMany();

        // Add parameters if needed (i.e. for tags)
        return await all(
            ...descriptors.map(async (entry) => {
                let parameters;

                if (entry.type === "tag") {
                    const values = await this.db
                        .select({ id: tags.id, label: tags.label, color: tags.color })
                        .from(tags)
                        .where(eq(tags.descriptorId, entry.id));

                    parameters = { multiple: entry.multiple, values: chain(values).keyBy("id").value() };
                }

                return { id: entry.id, name: entry.name, type: entry.type, parameters };
            }),
        );
    }

    @request("tasks")
    async getTasks(): Promise<ITaskResponse[]> {
        const des = await this.db.query.descriptors.findMany({ columns: { id: true, type: true } });

        const result = await this.db
            .select({
                task: tasks.id,
                descriptorId: values.descriptorId,
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
                            .filter(({ descriptorId }) => descriptorId === id)
                            .map((v) => v[type] ?? this.defaultFor(type));
                        const res = type === "text" ? v.first : v;
                        return [id, res];
                    })
                    .fromPairs()
                    .value(),
            }))
            .value();
    }

    @request("boardData")
    async getBoardData(): Promise<IBoardData> {
        return nonNull(await this.db.query.boards.findFirst());
    }

    @request("addTask")
    async addTask({ properties }: { properties?: { id: number; value: IPropertyValue }[] }) {
        const [{ id }] = await this.db.insert(tasks).values({}).returning({ id: tasks.id });
        if (properties?.nonEmpty) await this.updateTasks({ tasks: [{ id, properties }] });
        return { id };
    }

    @request("updateTasks")
    async updateTasks({
        tasks: tasksValue,
    }: {
        tasks: { id: number; properties: { id: number; value: IPropertyValue }[] }[];
    }) {
        const descriptors = await this.db.query.descriptors.findMany({ columns: { id: true, type: true } });
        const descriptorMap = chain(descriptors).keyBy("id").value();

        const plainValues = tasksValue.flatMap(({ id: taskId, properties }) =>
            properties.map(({ id: descriptorId, value }) => ({
                taskId,
                descriptorId,
                [descriptorMap[descriptorId].type]: this.valueByType(value, descriptorMap[descriptorId].type),
            })),
        );

        await this.db.insert(values).values(plainValues);
    }

    private valueByType<T extends IPropertyType>(value: IPropertyValue<T>, type: T) {
        switch (type) {
            case "text":
                return value;
            case "tag":
                return (value as IPropertyValue<"tag">).map((tag) => tag.id);
            case "relation":
                return (value as IPropertyValue<"relation">).map((relation) => relation.id);
            default:
                throw new Error(`Unknown type: ${type}`);
        }
    }

    private defaultFor(type: IPropertyType) {
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

// console.log(await new Api().getDescriptors());
// console.log(await new Api().getTasks());
// console.log(await new Api().getBoardData());
