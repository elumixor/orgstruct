// import type { ITask } from "@domain";
import { request } from "@elumixor/angular-server";

export class Api {
    @request("tasks")
    getGetTasks() {
        // return [] as ITask[];
    }
}
