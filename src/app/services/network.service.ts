import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { first } from "rxjs";
import { ItemObject, ItemType } from "../../domain";
import { DBEntry, Primitive } from "../../utils";

@Injectable({
    providedIn: "root",
})
export class NetworkService {
    readonly data = signal<DBEntry<ItemObject>[]>([]);

    constructor(protected readonly http: HttpClient) {
        this.updateData();
    }

    create(item: ItemType, params: Record<string, unknown> = {}) {
        this.http.post("/api/create", { type: item, ...params }).subscribe(() => this.updateData());
    }

    remove(item: DBEntry<ItemObject>) {
        this.http.post("/api/remove", { id: item.id }).subscribe(() => this.updateData());
    }

    update(item: DBEntry<ItemObject>, params: Record<string, unknown> = {}) {
        this.http.post("/api/update", { id: item.id, ...params }).subscribe(() => this.updateData());
    }

    toDbEntry(item: ItemObject) {
        return Object.fromEntries(
            Object.entries(item).map(([key, value]) => [key, this.fromObject(value)]),
        ) as DBEntry<ItemObject>;
    }

    fromObject(value: unknown): Primitive | Primitive[] {
        if (typeof value !== "object") return value as Primitive;
        if (Array.isArray(value)) return value.map((obj) => this.fromObject(obj)) as Primitive[];
        return (value as { id: number }).id;
    }

    get<T extends ItemType = ItemType>(itemId: number) {
        return this.data().find(({ id }) => id === itemId) as DBEntry<ItemObject<T>>;
    }

    getOffice(id: number) {
        return this.get<"office">(id);
    }

    getDivision(id: number) {
        return this.get<"division">(id);
    }

    getBranch(id: number) {
        return this.get<"branch">(id);
    }

    getPerson(id: number) {
        return this.get<"person">(id);
    }

    getPosition(id: number) {
        return this.get<"position">(id);
    }

    getTask(id: number) {
        return this.get<"task">(id);
    }

    protected updateData() {
        const data = this.http.post("/api/data", {});
        data.pipe(first()).subscribe((data) => this.data.set(data as DBEntry<ItemObject>[]));
    }
}
