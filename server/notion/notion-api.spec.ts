import { randomString } from "@utils";
import { NotionApi } from "./notion-api";

describe("NotionApi", () => {
    it("should get databases", async () => {
        const api = new NotionApi();
        const databases = await api.databases();
        expect(databases).toHaveProperty("Divisions");
        expect(databases).toHaveProperty("Offices");
        expect(databases).toHaveProperty("Branches");
        expect(databases).toHaveProperty("Processes");
        expect(databases).toHaveProperty("Tasks");
        expect(databases).toHaveProperty("Positions");
        expect(databases).toHaveProperty("People");
    });

    it("should get pages properties", async () => {
        const api = new NotionApi();
        const databases = await api.databases();
        const divisions = await api.getPages(databases.Divisions, {
            title: {
                name: "Title",
                type: "title",
            },
            description: {
                name: "Description",
                type: "rich_text",
            },
            product: {
                name: "Product",
                type: "rich_text",
            },
            offices: {
                name: "Offices",
                type: "relation",
            },
        });

        for (const division of divisions) {
            expect(division).toHaveProperty("id");
            expect(typeof division.title).toBe("string");
            expect(typeof division.description).toBe("string");
            expect(typeof division.product).toBe("string");
            expect(division.offices).toBeInstanceOf(Array);
        }
    });

    it("should create and delete pages", async () => {
        const api = new NotionApi();
        const databases = await api.databases();

        const title = randomString();
        const description = randomString();
        const product = randomString();

        const division = await api.createPage(databases.Divisions, [
            {
                name: "Title",
                type: "title",
                value: title,
            },
            {
                name: "Description",
                type: "rich_text",
                value: description,
            },
            {
                name: "Product",
                type: "rich_text",
                value: product,
            },
        ]);

        expect(division).toHaveProperty("id");

        const divisionId = division.id;

        const pages = await api.getPages(databases.Divisions);

        expect(pages.length).toBeGreaterThan(0);
        expect(pages).toContainEqual(expect.objectContaining({ id: divisionId }));

        const response = await api.getPage(divisionId, {
            title: {
                name: "Title",
                type: "title",
            },
            description: {
                name: "Description",
                type: "rich_text",
            },
            product: {
                name: "Product",
                type: "rich_text",
            },
        });

        expect(response).toHaveProperty("id");
        expect(response.title).toBe(title);
        expect(response.description).toBe(description);
        expect(response.product).toBe(product);

        await api.removePage(division.id);

        const pagesAfterDelete = await api.getPages(databases.Divisions);

        expect(pagesAfterDelete).not.toContainEqual(expect.objectContaining({ id: divisionId }));
    }, 20000);
});
