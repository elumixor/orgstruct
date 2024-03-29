import * as fs from "fs";
import { Express } from "express";
import { DBEntry, gettable } from "@utils";
import { ItemObject, ItemType } from "@domain";
import { create } from "./create";

export class DB {
    readonly items = gettable(() => this.getItems());

    readonly dataFilePath = `${process.cwd()}/data/data.json`;

    registerConnections(server: Express) {
        server.post("/api/data", async (_, res) => res.type("application/json").send(await this.items.get()));
        server.post("/api/create", async (req, res) => {
            try {
                const body = req.body as { type: ItemType } & Record<string, unknown>;
                await this.create(body.type, body);
                res.status(200).send({});
            } catch (e) {
                console.log(e);
                res.sendStatus(500).send(e);
            }
        });
        server.post("/api/remove", async (req, res) => {
            try {
                await this.removeItem((req.body as { id: number }).id);
                res.status(200).send({});
            } catch (e) {
                console.log(e);
                res.sendStatus(500).send(e);
            }
        });
        server.post("/api/update", async (req, res) => {
            try {
                const body = req.body as { id: number } & Record<string, unknown>;
                const current = await this.items.get();
                const updated = current.map((item) => (item.id === body.id ? { ...item, ...body } : item));
                await this.save(updated);
                res.status(200).send({});
            } catch (e) {
                console.log(e);
                res.sendStatus(500).send(e);
            }
        });
    }

    protected async getItems() {
        const data = await fs.promises.readFile(this.dataFilePath, "utf-8");
        return JSON.parse(data) as DBEntry<ItemObject>[];
    }

    protected async create(type: ItemType, params: Record<string, unknown>) {
        const current = await this.items.get();
        const updated = [...current, create(type, params, current)];
        await this.save(updated);
    }

    protected async removeItem(id: number) {
        const current = await this.items.get();
        const updated = current.filter((item) => item.id !== id);

        // Clear references to this item
        type Key = keyof ItemObject;
        for (const item of updated) {
            for (const [key, value] of Object.entries(item))
                if (value === id) delete item[key as Key];
                else if (Array.isArray(value)) item[key as Key] = value.filter((nestedId) => nestedId !== id) as never;
        }

        // Clear children of this item

        await this.save(updated);
    }

    protected save(items: DBEntry<ItemObject>[], path = this.dataFilePath) {
        return fs.promises.writeFile(path, JSON.stringify(items, null, 2));
    }
}
