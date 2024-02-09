import { Identifier, ItemKey, ItemObject, ItemType, databaseNames } from "@domain";
import { IRequests } from "@network-api";
import { DBEntry, Refs2Id, all, cyan, green, lazy, red } from "@utils";
import { Express, Request, Response } from "express";
import { NotionApi } from "../notion";
import { notionDatabaseDescriptors, propertiesToNotion } from "./property-types";

export class Api implements IRequests {
    readonly notion = new NotionApi();

    private readonly databaseMap = lazy(() => this.notion.databases());

    registerConnections(server: Express) {
        const handle = (path: string, handler: (req: Request, res: Response) => Promise<unknown>) => {
            server.post(`/api/${path}`, async (req, res) => {
                try {
                    const now = new Date();
                    const date = `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`;

                    const params = req.params;

                    // Replace :param with actual values
                    let substituted = path;
                    for (const [key, value] of Object.entries(params))
                        substituted = substituted.replace(`:${String(key)}`, value);

                    console.log(cyan(`${date}: API request: ${substituted}`));
                    console.dir(req.body, { depth: null, colors: true });

                    res.type("application/json");
                    const result = await handler(req, res);
                    res.status(200).send(result);
                } catch (e) {
                    console.error(red(String(e)));
                    const message = (e as { message?: string }).message ?? "unknown error";

                    res.status(500).send({ message });
                }
            });
        };

        handle("get/:itemType", ({ params: { itemType }, body }) => this.get(itemType as ItemType, body));
        handle("create/:itemType", ({ params: { itemType }, body }) => this.create(itemType as ItemType, body));
        handle("update/:itemType", ({ params: { itemType }, body }) => this.update(itemType as ItemType, body));
        handle("pages/:itemType", ({ params: { itemType }, body }) => this.pages(itemType as ItemType, body));
        handle("delete/:itemType", ({ params: { itemType }, body }) => this.delete(itemType as ItemType, body));

        handle("databases", () => this.databases());

        console.log(green("API initialized"));
    }

    databases() {
        return this.databaseMap.get();
    }

    // Api implementation
    async get<T extends ItemType>(itemType: T, { id }: Identifier) {
        const properties = notionDatabaseDescriptors[itemType];
        const result = await this.notion.getPage(id, properties);
        return {
            type: itemType,
            ...result,
        } as DBEntry<T>;
    }

    async create<T extends ItemType>(itemType: T, params: Refs2Id<ItemObject<T>>) {
        const databaseId = (await this.databaseMap.get())[databaseNames[itemType]] as string;
        const propertyRequests = propertiesToNotion(itemType, params);
        return this.notion.createPage(databaseId, propertyRequests);
    }

    async update<T extends ItemType>(itemType: T, { id, ...params }: Identifier & Partial<Refs2Id<ItemObject<T>>>) {
        const propertyRequests = propertiesToNotion(itemType, params as unknown as Refs2Id<ItemObject<T>>);
        await this.notion.updatePage(id, propertyRequests);
    }

    async pages<T extends ItemType, P extends ItemKey<T> = ItemKey<T>>(
        itemType: T,
        params: { properties?: P[] } = {},
    ): Promise<(DBEntry<T> & Identifier & { type: T })[]> {
        const selectedProperties = params.properties ?? [];
        const describedProperties = notionDatabaseDescriptors[itemType];
        const selectedDescribedPoperties = Object.fromEntries(
            selectedProperties.map((name) => [name, describedProperties[name]]),
        );

        const databaseId = (await this.databaseMap.get())[databaseNames[itemType]];
        const pages = await this.notion.getPages(databaseId, selectedDescribedPoperties);

        return (pages as (Refs2Id<ItemObject<T>> & Identifier)[]).map((page) => ({ type: itemType, ...page }));
    }

    async delete<T extends ItemType>(itemType: T, { id }: { id: string }) {
        await this.notion.removePage(id);

        if (itemType === "task") return;
        if (itemType === "process") return;
        if (itemType === "branch") {
            // Also remove tasks and processes ?
            return;
        }
        if (itemType === "office") {
            // Also remove branches
            const office = await this.get("office", { id });
            await all(...office.branches.map((branch) => this.delete("branch", { id: branch.id })));
            return;
        }
        if (itemType === "division") {
            // Also remove offices
            const division = await this.get("division", { id });
            await all(...division.offices.map((office) => this.delete("office", { id: office.id })));
            return;
        }
    }
}
