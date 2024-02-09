import { randomString } from "@utils";
import { Api } from "./api";

describe("Api", () => {
    const api = new Api();

    it("should get databases", async () => {
        const databases = await api.databases();
        expect(databases).toHaveProperty("Divisions");
        expect(databases).toHaveProperty("Offices");
        expect(databases).toHaveProperty("Branches");
        expect(databases).toHaveProperty("Processes");
        expect(databases).toHaveProperty("Tasks");
        expect(databases).toHaveProperty("Positions");
        expect(databases).toHaveProperty("People");
    });

    it("should get divisions", async () => {
        const divisions = await api.pages("division");
        for (const division of divisions) {
            expect(division).toHaveProperty("id");
            expect(division).toHaveProperty("type");
            expect(division).toHaveProperty("title");
            expect(division).toHaveProperty("description");
            expect(division).toHaveProperty("product");
            expect(division).toHaveProperty("offices");
        }
    });

    it("should create, update and remove division", async () => {
        const title = randomString();
        const description = randomString();
        const product = randomString();

        const divisionIdentifier = await api.create("division", {
            title,
            description,
            product,
            offices: [],
        });

        expect(divisionIdentifier).toHaveProperty("id");

        const division = await api.get("division", divisionIdentifier);

        expect(division.title).toBe(title);
        expect(division.description).toBe(description);
        expect(division.product).toBe(product);

        const newTitle = randomString();
        const newDescription = randomString();

        await api.update("division", {
            id: divisionIdentifier.id,
            title: newTitle,
            description: newDescription,
        });

        const updatedDivision = await api.get("division", divisionIdentifier);

        expect(updatedDivision.title).toBe(newTitle);
        expect(updatedDivision.description).toBe(newDescription);
        expect(updatedDivision.product).toBe(product);

        await api.delete(divisionIdentifier);
    });

    it("should get tasks", async () => {
        debugger;
        const tasks = await api.pages("task");
        expect(tasks).toBeInstanceOf(Array);
    }, 100_000);
});
