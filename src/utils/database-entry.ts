import type { Identifier, Entity, EntityName } from "../domain";
import type { Primitive } from "./primitive";

// Maps an object to identifier, unless it is an array.
// If it is an array, keeps it an array, but applies the mapping to the inner elements, recursively.
type Object2Id<T> = T extends Primitive ? T : T extends (infer U)[] ? Object2Id<U>[] : Identifier;

// Checks all the properties of an object and tries to apply `Object2Id` to them
type Fields2Ids<T> = { [P in keyof T]: Object2Id<T[P]> };

// `Fields2Ids` but instead of an object, we provide an ItemType
export type Plain<T extends EntityName> = Fields2Ids<Entity<T>>;
// `Fields2Ids` but also with Identifier and its type
export type MetaPlain<T extends EntityName = EntityName> = Plain<T> & Identifier & { type: T };
