import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { DatabaseName, Identifier, ItemKey, ItemObject, ItemType } from "@domain";
import { IRequests } from "@network-api";
import { DBEntry, Primitive, Refs2Id } from "@utils";
import { lastValueFrom, tap } from "rxjs";
import { itemsProperties } from "../../../server/api/property-types";

@Injectable({
    providedIn: "root",
})
export class NetworkService implements IRequests {
    readonly currentError = signal<string | undefined>(undefined);

    constructor(private readonly http: HttpClient) {}

    // Requests
    get<T extends ItemType>(itemType: T, params: Identifier) {
        return this.post<DBEntry<T>>(`get/${itemType}`, params);
    }
    create<T extends ItemType>(itemType: T, params: Refs2Id<ItemObject<T>>) {
        return this.post<Identifier>(`create/${itemType}`, stripUnneeded(itemType, params));
    }
    update<T extends ItemType>(itemType: T, params: Identifier & Partial<Refs2Id<ItemObject<T>>>) {
        return this.post<void>(`update/${itemType}`, { ...stripUnneeded(itemType, params), id: params.id });
    }
    delete<T extends ItemType>(itemType: T, params: Identifier) {
        return this.post<void>(`delete/${itemType}`, params);
    }
    databases() {
        return this.post<Record<DatabaseName, string>>("databases");
    }

    async pages<T extends ItemType, P extends ItemKey<T> = ItemKey<T>>(
        itemType: T,
        params: { properties?: P[] } = {},
    ): Promise<(DBEntry<T> & Identifier & { type: T })[]> {
        return this.post<(DBEntry<T> & Identifier & { type: T })[]>(`pages/${itemType}`, params);
    }

    // Helpers
    private post<T = unknown>(path: string, params?: Record<string, unknown>) {
        return lastValueFrom(
            this.http.post(`/api/${path}`, params).pipe(
                tap({
                    error: (e: { error?: { message?: string } }) =>
                        this.currentError.set(e.error?.message ?? "Unknown error"),
                }),
            ),
        ) as Promise<T>;
    }
}

function stripUnneeded<T extends ItemType, P extends Partial<Refs2Id<ItemObject<T>>>>(itemType: T, params: P) {
    return Object.fromEntries(
        itemsProperties[itemType]
            .filter((property) => Reflect.has(params, property))
            .map((property) => [property, leaveIdentifier(params[property])] as const),
    ) as unknown as P;
}

function leaveIdentifier(
    obj: Record<string, unknown> | Identifier | Primitive | Array<Identifier | Primitive>,
): Primitive | Identifier | Array<Identifier | Primitive> {
    if (Array.isArray(obj)) return obj.map(leaveIdentifier) as Array<Identifier | Primitive>;
    if (typeof obj === "object") return { id: (obj as Identifier).id };
    return obj as Primitive;
}
