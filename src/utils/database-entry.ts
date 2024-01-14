import { ItemType } from "../domain";
import { Primitive } from "./primitive";

// For database entries, we rip out all the object types and replace them with numbers (ids)
export type DBEntry<T> = {
    [P in keyof T]: Object2Id<T[P]>;
} & { id: number; type: ItemType };

export type Object2Id<T> = T extends Primitive ? T : T extends Array<infer U> ? Array<Object2Id<U>> : number;
