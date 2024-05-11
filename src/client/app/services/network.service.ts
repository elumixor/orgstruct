import { HttpClient } from "@angular/common/http";
import { Injectable, inject, isDevMode } from "@angular/core";
import type { IBoardData, IPropertyDescriptor, ITaskResponse } from "@shared";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class NetworkService {
    getTasks() {
        return this.post<ITaskResponse[]>("tasks");
    }

    getDescriptors() {
        return this.post<IPropertyDescriptor[]>("descriptors");
    }

    getBoardData() {
        return this.post<IBoardData>("boardData");
    }

    addTask() {
        return this.post<{ id: number }>("addTask");
    }

    private readonly http = inject(HttpClient);
    private readonly url = isDevMode() ? `http://${import.meta.env.NG_APP_URL}:4000` : "";

    async post<T = unknown>(path: string, params?: Record<string, unknown>) {
        // eslint-disable-next-line no-console
        if (isDevMode()) console.log(`API request: ${path}`, params);

        const result = (await lastValueFrom(this.http.post(`${this.url}/api/${path}`, params))) as Promise<T>;

        // eslint-disable-next-line no-console
        if (isDevMode()) console.log(`API Response: ${path}`, result);

        return result;
    }
}
