import {
    entityName2NotionName,
    notionProperties,
    notionPropertiesMap,
    type Entity,
    type EntityName,
    type Identifier,
    type MetaPlain,
    type Plain,
} from "@domain";
import type { IRequests } from "@network-api";
import { all, cyan, green, lazy, magenta, red } from "@utils";
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

                            // eslint-disable-next-line no-console
                            console.log(cyan(`${date}: API request: ${substituted}`));
                            // eslint-disable-next-line no-console
                            console.dir(req.body, { depth: null, colors: true });

                            res.type("application/json");
                            const result = await handler(req, res);
                            // eslint-disable-next-line no-console
                            console.log(magenta(`${date}: API response ${substituted}`));
                            // eslint-disable-next-line no-console
                            console.dir(result, { depth: null, colors: true });
                            res.status(200).send(result);
                        } catch (e) {
                            const message = (e as { message?: string }).message ?? "unknown error";
                            const stackTrace = e instanceof Error ? e.stack ?? "" : "";
                            // eslint-disable-next-line no-console
                            console.error(red(String(e)) + "\n" + stackTrace);

                            res.status(500).send({ message, stackTrace });
                        }
                    })(req, res),
            );
        };

        handle("get/:itemType", ({ params: { itemType }, body }) =>
            this.get(itemType as EntityName, body as Identifier),
        );
        handle("create/:itemType", ({ params: { itemType }, body }) =>
            this.create(itemType as EntityName, body as Plain<EntityName> & Identifier),
        );
        handle("update/:itemType", ({ params: { itemType }, body }) =>
            this.update(itemType as EntityName, body as Plain<EntityName> & Identifier),
        );
        handle("pages/:itemType", ({ params: { itemType }, body }) =>
            this.pages(itemType as EntityName, body as { properties?: never[] }),
        );
        handle("delete/:itemType", ({ params: { itemType }, body }) =>
            this.delete(itemType as EntityName, body as Identifier),
        );

        handle("databases", () => this.databases());

        // eslint-disable-next-line no-console
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

    async update<T extends EntityName, K extends keyof Plain<T>>(
        entityName: T,
        { id, ...params }: Identifier & Pick<Plain<T>, K>,
    ) {
        const propertyRequests = notionProperties(entityName, params as unknown as Plain<T>);
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
        switch (itemType) {
            case "task":
            case "process":
            case "branch":
                break;
            case "office": {
                // Also remove branches
                const office = await this.get("office", { id });
                await all(...office.branches.map((branch) => this.delete("branch", { id: branch.id })));
                break;
            }
            case "division": {
                // Also remove offices
                const division = await this.get("division", { id });
                await all(...division.offices.map((office) => this.delete("office", { id: office.id })));
                break;
            }
        }

        await this.notion.removePage(id);
    }
}
