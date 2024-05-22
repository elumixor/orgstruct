import { HttpClient } from "@angular/common/http";
import { Injectable, inject, isDevMode } from "@angular/core";
import type { IBoardData, PropertyResponse, TaskResponse } from "@shared";
import { lastValueFrom } from "rxjs";
import type { Request } from "../../../server/api";

@Injectable({
    providedIn: "root",
})
export class NetworkService {
    getProperties() {
        return this.post<PropertyResponse[]>("property/all");
    }

    addProperty(params: Request<"addProperty">) {
        return this.post<{ id: number }>("property/new", params);
    }

    updateProperty(params: Request<"updateProperty">) {
        return this.post("property/update", params);
    }

    deleteProperty(params: Request<"deleteProperty">) {
        return this.post("property/delete", params);
    }

    getTasks() {
        return this.post<TaskResponse[]>("task/all");
    }

    addTask() {
        return this.post<{ id: number }>("task/new");
    }

    updateTask(params: Request<"updateTasks">) {
        return this.post("task/update", params);
    }

    deleteTask(params: Request<"deleteTask">) {
        return this.post("task/delete", params);
    }

    getBoardData() {
        return this.post<IBoardData>("board");
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
