import { ItemType } from "../domain";
import { Primitive } from "./primitive";

// For database entries, we rip out all the object types and replace them with numbers (ids)
export type DBEntry<T> = {
    [P in keyof T]: Object2Id<T[P]>;
} & { id: number; type: ItemType };

export type Object2Id<T> = T extends Primitive ? T : T extends Array<infer U> ? Array<Object2Id<U>> : number;

type A = {
    a: number;
    b: object;
};

// This should get mapped to { a: number, bId: number }

type Mapper<T> = {
    [P in keyof T & string as `${P}Id`]: T[P] extends Primitive
        ? never
        : T[P] extends Array<infer U>
          ? Array<Mapper<U>>
          : number;
};

type B = Mapper<A>;
//   ^?

declare const b: B;
b.aId;
b.bId;
