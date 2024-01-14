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

    constructor(private readonly http: HttpClient) {
        this.updateData();
    }

    protected updateData() {
        const data = this.http.post("/api/data", {});
        data.pipe(first()).subscribe((data) => this.data.set(data as DBEntry<ItemObject>[]));
    }

    createDefault(item: ItemType, params: Record<string, unknown> = {}) {
        this.http.post("/api/create", { type: item, ...params }).subscribe(() => this.updateData());
    }

    remove(item: DBEntry<ItemObject>) {
        this.http.post("/api/remove", { id: item.id }).subscribe(() => this.updateData());
    }

    toDbEntry(item: ItemObject) {
        return Object.fromEntries(
            Object.entries(item).map(([key, value]) => [key, this.fromObject(value)])
        ) as DBEntry<ItemObject>;
    }

    fromObject(value: unknown): Primitive | Primitive[] {
        if (typeof value !== "object") return value as Primitive;
        if (Array.isArray(value)) return value.map((obj) => this.fromObject(obj)) as Primitive[];
        return (value as { id: number }).id;
    }
}
