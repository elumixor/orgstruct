import {
    type Identifier,
    type Entity,
    type EntityName,
    entityName2NotionName,
    notionProperties,
    notionProperty,
    notionPropertiesMap,
} from "@domain";
import type { IRequests } from "@network-api";
import { type MetaPlain, type Plain, all, cyan, green, lazy, red, magenta } from "@utils";
import type { Express, Request, Response } from "express";
import { NotionApi, type SetPropertyRequest } from "../notion";

export class Api implements IRequests {
    readonly notion = new NotionApi();

    private readonly databaseMap = lazy(() => this.notion.databases());

    registerConnections(server: Express) {
        const handle = (path: string, handler: (req: Request, res: Response) => Promise<unknown>) => {
            server.post(
                `/api/${path}`,
                (req, res) =>
                    void (async (req, res) => {
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
                            console.log(magenta(`${date}: API response ${substituted}`));
                            console.dir(result, { depth: null, colors: true });
                            res.status(200).send(result);
                        } catch (e) {
                            console.error(red(String(e)));
                            const message = (e as { message?: string }).message ?? "unknown error";

                            res.status(500).send({ message });
                        }
                    })(req, res),
            );
        };

        handle("get/:itemType", ({ params: { itemType }, body }) => this.get(itemType as EntityName, body));
        handle("create/:itemType", ({ params: { itemType }, body }) => this.create(itemType as EntityName, body));
        handle("update/:itemType", ({ params: { itemType }, body }) => this.update(itemType as EntityName, body));
        handle("pages/:itemType", ({ params: { itemType }, body }) => this.pages(itemType as EntityName, body));
        handle("delete/:itemType", ({ params: { itemType }, body }) => this.delete(itemType as EntityName, body));

        handle("databases", () => this.databases());

        console.log(green("API initialized"));
    }

    databases() {
        return this.databaseMap.get();
    }

    // Api implementation
    async get<T extends EntityName>(itemType: T, { id }: Identifier) {
        const properties = notionPropertiesMap[itemType];
        const result = await this.notion.getPage(id, properties);
        return {
            type: itemType,
            ...result,
        } as MetaPlain<T>;
    }

    async create<T extends EntityName>(itemType: T, params: Plain<T>) {
        const databaseId = (await this.databaseMap.get())[entityName2NotionName[itemType]] as string;
        const propertyRequests = notionProperties(itemType, params);
        return this.notion.createPage(databaseId, propertyRequests as unknown as SetPropertyRequest[]);
    }

    async update<T extends EntityName>(itemType: T, { id, ...params }: Identifier & Partial<Plain<T>>) {
        const propertyRequests = notionProperties(itemType, params as unknown as Plain<T>);
        await this.notion.updatePage(id, propertyRequests as unknown as SetPropertyRequest[]);
    }

    async pages<T extends EntityName, P extends keyof Entity<T> = keyof Entity<T>>(
        itemType: T,
        params: { properties?: P[] } = {},
    ): Promise<(MetaPlain<T> & Identifier & { type: T })[]> {
        const selectedProperties = params.properties ?? [];
        const describedProperties = notionPropertiesMap[itemType];
        const selectedDescribedPoperties = Object.fromEntries(
            selectedProperties.map((name) => [name, describedProperties[name]]),
        );

        const databaseId = (await this.databaseMap.get())[entityName2NotionName[itemType]];
        const pages = await this.notion.getPages(databaseId, selectedDescribedPoperties);

        return (pages as (Plain<T> & Identifier)[]).map((page) => ({ type: itemType, ...page }));
    }

    async delete<T extends EntityName>(itemType: T, { id }: { id: string }) {
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
