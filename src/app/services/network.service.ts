import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import type { NotionName, Identifier, EntityName, Entity, MetaPlain, Plain } from "@domain";
import type { IRequests } from "@network-api";
import { cyan, magenta } from "@utils";
import { lastValueFrom, tap } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class NetworkService implements IRequests {
    readonly currentError = signal<string | undefined>(undefined);

    private readonly http = inject(HttpClient);

    // Requests
    get<T extends EntityName>(entityName: T, params: Identifier) {
        return this.post<MetaPlain<T>>(`get/${entityName}`, { id: params.id });
    }

    create<T extends EntityName>(entityName: T, params: Plain<T>) {
        // return this.post<Identifier>(`create/${entityName}`, stripUnneeded(entityName, params));
        return this.post<Identifier>(`create/${entityName}`, params);
    }
    async update<T extends EntityName, K extends keyof Plain<T>>(
        entityName: T,
        params: Identifier & Pick<Plain<T>, K>,
    ) {
        // await this.post(`update/${entityName}`, { ...stripUnneeded(entityName, params), id: params.id });
        await this.post(`update/${entityName}`, params);
    }
    async delete<T extends EntityName>(entityName: T, params: Identifier) {
        await this.post(`delete/${entityName}`, { id: params.id });
    }
    databases() {
        return this.post<Record<NotionName, string>>("databases");
    }

    async pages<T extends EntityName, P extends keyof Entity<T> = keyof Entity<T>>(
        entityName: T,
        params: { properties?: P[] } = {},
    ): Promise<MetaPlain<T>[]> {
        return this.post<MetaPlain<T>[]>(`pages/${entityName}`, params);
    }

    // Helpers
    private async post<T = unknown>(path: string, params?: Record<string, unknown>) {
        // eslint-disable-next-line no-console
        console.log(cyan(`API request: ${path}`), params);

        const result = (await lastValueFrom(
            this.http.post(`/api/${path}`, params).pipe(
                tap({
                    error: (e: { error?: { message?: string } }) =>
                        this.currentError.set(e.error?.message ?? "Unknown error"),
                }),
            ),
        )) as Promise<T>;

        // eslint-disable-next-line no-console
        console.log(magenta(`API Response: ${path}`), result);

        return result;
    }
}

// function stripUnneeded<T extends EntityName, P extends Partial<Plain<T>>>(entityName: T, params: P): P {
//     return Object.fromEntries(
//         notionPropertiesMap[entityName]
//             .filter((property) => Reflect.has(params, property))
//             .map((property) => [property, leaveIdentifier(params[property])] as const),
//     ) as unknown as P;
// }

// function leaveIdentifier(
//     obj: Record<string, unknown> | Identifier | Primitive | (Identifier | Primitive)[],
// ): Primitive | Identifier | (Identifier | Primitive)[] {
//     if (Array.isArray(obj)) return obj.map(leaveIdentifier) as (Identifier | Primitive)[];
//     if (typeof obj === "object") return { id: (obj as Identifier).id };
//     return obj as Primitive;
// }
