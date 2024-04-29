import type { IEntity } from "@domain";
import { request } from "@elumixor/angular-server";

export class Api {
    @request("echo")
    getMessages({ data }: IEntity) {
        return { data };
    }
}
