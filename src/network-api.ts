import type { NotionName, Identifier, EntityName, Entity, MetaPlain, Plain } from "@domain";

export interface IRequests {
    get<T extends EntityName>(itemType: T, params: Identifier): PromiseLike<MetaPlain<T>>;
    create<T extends EntityName>(itemType: T, params: Plain<T>): PromiseLike<Identifier>;
    update<T extends EntityName, K extends keyof Plain<T>>(
        entityName: T,
        params: Identifier & Pick<Plain<T>, K>,
    ): PromiseLike<void>;
    delete<T extends EntityName>(itemType: T, params: Identifier): PromiseLike<void>;

    pages<T extends EntityName, P extends keyof Entity<T> = keyof Entity<T>>(
        itemType: T,
        params?: { properties?: P[] },
    ): PromiseLike<(MetaPlain<T> & Identifier & { type: T })[]>;

    databases(): PromiseLike<Record<NotionName, string>>;
}
