import { Identifier, ItemObject, ItemType } from "../domain";
import { Primitive } from "./primitive";

// For database entries, we rip out all the object types and replace them with numbers (ids)
export type Refs2Id<T> = { [P in keyof T]: Object2Id<T[P]> };
export type Object2Id<T> = T extends Primitive ? T : T extends Array<infer U> ? Array<Object2Id<U>> : Identifier;

export type DBEntry<T extends ItemType = ItemType> = Refs2Id<ItemObject<T>> & Identifier & { type: T };
