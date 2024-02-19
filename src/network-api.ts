import type { NotionName, Identifier, EntityName, Entity } from "@domain";
import type { MetaPlain, Plain } from "@utils";

export interface IRequests {
    get<T extends EntityName>(itemType: T, params: Identifier): PromiseLike<MetaPlain<T>>;
    create<T extends EntityName>(itemType: T, params: Plain<T>): PromiseLike<Identifier>;
    update<T extends EntityName>(itemType: T, params: Identifier & Partial<Plain<T>>): PromiseLike<void>;
    delete<T extends EntityName>(itemType: T, params: Identifier): PromiseLike<void>;

    pages<T extends EntityName, P extends keyof Entity<T> = keyof Entity<T>>(
        itemType: T,
        params?: { properties?: P[] },
    ): PromiseLike<(MetaPlain<T> & Identifier & { type: T })[]>;

    databases(): PromiseLike<Record<NotionName, string>>;
}
