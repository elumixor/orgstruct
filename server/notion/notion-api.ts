import * as fs from "fs";
import * as path from "path";
import { DatabaseName } from "@domain";
import { ChildDatabaseBlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Client as NotionClient } from "@notionhq/client";
import { extractProperties } from "./extract-property";
import { NotionPropertyDescriptor } from "./property-types";
import { SetPropertyRequest, createProperties } from "./create-property";

export class NotionApi {
    // Initializing a client
    private readonly notion = new NotionClient({
        auth: fs.readFileSync(path.resolve(process.cwd(), "notion.token"), "utf8"), // todo: change to something more secure
    });

    private readonly orgstructId = fs.readFileSync(path.resolve(process.cwd(), "orgstruct.id"), "utf8"); // todo: change to something more secure

    async databases() {
        // Make request: get blocks
        const { results } = await this.notion.blocks.children.list({
            block_id: this.orgstructId,
        });

        // Filter the child databases
        const databases = results.filter(
            (result) => "type" in result && result.type === "child_database",
        ) as ChildDatabaseBlockObjectResponse[];

        // Return their titles and ids
        return Object.fromEntries(databases.map(({ id, child_database: { title } }) => [title, id] as const)) as Record<
            DatabaseName,
            string
        >;
    }

    async getPages<T extends Record<string, NotionPropertyDescriptor>>(
        databaseId: string,
        properties: T = {} as T extends Record<string, never> ? T : never,
    ) {
        const response = await this.notion.databases.query({ database_id: databaseId });
        const results = response.results as PageObjectResponse[];
        return results.map((result) => ({
            id: result.id,
            ...extractProperties(result, properties),
        }));
    }

    async getPage<T extends Record<string, NotionPropertyDescriptor>>(pageId: string, properties: T) {
        const response = await this.notion.pages.retrieve({ page_id: pageId });
        return {
            id: response.id,
            ...extractProperties(response as PageObjectResponse, properties),
        };
    }

    async createPage(databaseId: string, properties: SetPropertyRequest[]) {
        const { id } = await this.notion.pages.create({
            parent: {
                database_id: databaseId,
            },
            properties: createProperties(properties),
        });

        return { id };
    }

    async removePage(pageId: string) {
        return this.notion.pages.update({
            page_id: pageId,
            archived: true,
        });
    }

    async updatePage(pageId: string, properties: SetPropertyRequest[]) {
        return this.notion.pages.update({
            page_id: pageId,
            properties: createProperties(properties),
        });
    }
}
