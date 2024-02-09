import { DatabaseName, Identifier, ItemKey, ItemObject, ItemType } from "@domain";
import { DBEntry, Refs2Id } from "@utils";

export interface IRequests {
    get<T extends ItemType>(itemType: T, params: Identifier): PromiseLike<DBEntry<T>>;
    create<T extends ItemType>(itemType: T, params: Refs2Id<ItemObject<T>>): PromiseLike<Identifier>;
    update<T extends ItemType>(itemType: T, params: Identifier & Partial<Refs2Id<ItemObject<T>>>): PromiseLike<void>;
    delete<T extends ItemType>(itemType: T, params: Identifier): PromiseLike<void>;

    pages<T extends ItemType, P extends ItemKey<T> = ItemKey<T>>(
        itemType: T,
        params?: { properties?: P[] },
    ): PromiseLike<(DBEntry<T> & Identifier & { type: T })[]>;

    databases(): PromiseLike<Record<DatabaseName, string>>;
}
