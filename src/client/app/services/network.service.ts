import { HttpClient } from "@angular/common/http";
import { Injectable, inject, isDevMode } from "@angular/core";
import type { IBoardData, IPropertyDescriptor, ITaskResponse } from "@shared";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class NetworkService {
    // Dummy response from the server
    readonly dummyDescriptors = Promise.resolve<IPropertyDescriptor[]>([
        {
            id: "1",
            name: "Name",
            type: "text",
        } satisfies IPropertyDescriptor<"text">,
        {
            id: "2",
            name: "Children",
            type: "relation",
        } satisfies IPropertyDescriptor<"relation">,
        {
            id: "3",
            name: "Parents",
            type: "relation",
        } satisfies IPropertyDescriptor<"relation">,
        {
            id: "4",
            name: "Priority",
            type: "tag",
            parameters: {
                multiple: false,
                values: [
                    { name: "Critical", color: "#ff7755" },
                    { name: "High", color: "#aaff33" },
                    { name: "Normal", color: "#33aa22" },
                    { name: "Minor", color: "#2222aa" },
                ],
            },
        } satisfies IPropertyDescriptor<"tag">,
        {
            id: "5",
            name: "Deadline",
            type: "moment",
        } satisfies IPropertyDescriptor<"moment">,
        {
            id: "6",
            name: "Related",
            type: "relation",
        } satisfies IPropertyDescriptor<"relation">,
    ]);

    // Dummy response from the server
    readonly dummyTasks = Promise.resolve<ITaskResponse[]>([
        {
            id: "1",
            properties: { "1": "Task 1", "2": ["3"], "3": [], "4": [0], "5": new Date(), "6": [] },
        } satisfies ITaskResponse,
        {
            id: "2",
            properties: { "1": "Task 2", "2": ["5"], "3": [], "4": [1], "5": new Date(), "6": [] },
        } satisfies ITaskResponse,
        {
            id: "3",
            properties: { "1": "Task 3", "2": ["4", "5"], "3": ["1"], "4": [2], "5": new Date(), "6": [] },
        } satisfies ITaskResponse,
        {
            id: "4",
            properties: { "1": "Task 4", "2": [], "3": ["1", "3"], "4": [2], "5": new Date(), "6": [] },
        } satisfies ITaskResponse,
        {
            id: "5",
            properties: { "1": "Task 5", "2": [], "3": ["2", "3"], "4": [3], "5": new Date(), "6": [] },
        } satisfies ITaskResponse,
    ]);

    readonly boardData = Promise.resolve<IBoardData>({
        namePropertyId: "1",
        childrenPropertyId: "2",
        parentsPropertyId: "3",
    });

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
