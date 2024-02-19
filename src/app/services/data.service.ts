import { Injectable, signal, type Signal, inject } from "@angular/core";
import type { EntityName, Identifier } from "@domain";
import { notImplemented, type MetaPlain, type Plain } from "@utils";
import { NetworkService } from "./network.service";

export function idArray() {
    const sig = signal(undefined as Identifier[] | undefined);
    const remove = (value: Identifier) => sig.update((items) => items?.filter((item) => item.id !== value.id));
    const add = (...value: Identifier[]) => sig.update((items) => [...(items ?? []), ...value]);
    Reflect.defineProperty(sig, "remove", { value: remove });
    Reflect.defineProperty(sig, "add", { value: add });
    return sig as typeof sig & {
        remove: typeof remove;
        add: typeof add;
    };
}

export function linkedArray<T extends EntityName>(
    entityName: T,
    initializer: () => Plain<T>,
    network = inject(NetworkService),
) {
    const sig = idArray();

    const previousAdd = sig.add;
    const previousRemove = sig.remove;

    const linkedAdd = async () => {
        const defaultItem = initializer();
        const id = await network.create(entityName, defaultItem);
        previousAdd(id);
    };

    const linkedRemove = (item: Identifier) => {
        previousRemove(item);
        void network.delete(entityName, item);
    };

    Reflect.defineProperty(sig, "linkedAdd", { value: linkedAdd });
    Reflect.defineProperty(sig, "linkedRemove", { value: linkedRemove });

    return sig as typeof sig & {
        linkedAdd: typeof linkedAdd;
        linkedRemove: typeof linkedRemove;
    };
}
export type LinkedArray<T extends EntityName> = ReturnType<typeof linkedArray<T>>;

@Injectable({
    providedIn: "root",
})
export class DataService {
    private readonly network = inject(NetworkService);
    // private readonly divisions = this.lazyArray("division");

    /**
     * Takes an identifier, returns a signal that will be initialized with the item from the network request.
     * Until the network request is resolved, the signal yield `undefined`.
     */
    lazyGet<T extends EntityName>(entityName: T, id: Identifier): Signal<MetaPlain<T> | undefined> {
        const sig = signal(undefined as MetaPlain<T> | undefined);
        void this.network.get(entityName, id).then((item) => sig.set(item));
        return sig;
    }

    /**
     * Takes an initial object, asks the network to create it.
     * Returns a signal that is initialized with the provided values.
     * When the network request is resolved, the signal is updated with the correct id.
     */
    lazyCreate<T extends EntityName>(entityName: T, initializer: Plain<T>): Signal<MetaPlain<T>> {
        const sig = signal({ ...initializer, id: "", type: entityName } as MetaPlain<T>);
        void this.network.create(entityName, initializer).then((id) => sig.update((item) => ({ ...item, id })));
        return sig;
    }

    // /**
    //  * Takes an entity name and returns all items of that type from the network.
    //  * If an array of identifiers is provided, then takes only those items.
    //  */
    // lazyArray<T extends EntityName>(
    //     entityName: T,
    //     defaultItem: () => Plain<T>,
    //     initialIds?: Identifier[],
    // ): Signal<Signal<MetaPlain<T> | undefined>[] | undefined> & {
    //     pushFrom(...id: Identifier[]): Signal<MetaPlain<T> | undefined>[];
    //     addNew(): Signal<MetaPlain<T>>;
    //     remove(item: Identifier): void;
    // } {
    //     const sig = signal(undefined as Signal<MetaPlain<T> | undefined>[] | undefined);

    //     const pushFrom = (...ids: Identifier[]) => {
    //         // For each id, create a lazyGet signal and push it to the array
    //         const items = ids.map((id) => this.lazyGet(entityName, id));
    //         // Update the array with the new items
    //         sig.update((oldItems) => [...(oldItems ?? []), ...items]);
    //         return items;
    //     };

    //     const addNew = () => {
    //         const item = this.lazyCreate(entityName, defaultItem());
    //         sig.update((items) => [...(items ?? []), item]);
    //         return item;
    //     };

    //     const remove = (item: Identifier) => {
    //         sig.update((items) => items?.filter((i) => i !== item));
    //         void this.network.delete(entityName, item);
    //     };

    //     Reflect.defineProperty(sig, "pushGet", { value: pushFrom });
    //     Reflect.defineProperty(sig, "pushCreate", { value: addNew });
    //     Reflect.defineProperty(sig, "remove", { value: remove });

    //     return sig as typeof sig & {
    //         pushFrom: typeof pushFrom;
    //         addNew: typeof addNew;
    //         remove: typeof remove;
    //     };
    // }

    creatorFns = {
        division: this.newDivision.bind(this),
        office: this.newOffice.bind(this),
        branch: this.newBranch.bind(this),
        task: this.newTask.bind(this),
        get process() {
            return notImplemented();
        },
        get person() {
            return notImplemented();
        },
        get position() {
            return notImplemented();
        },
    } satisfies { [K in EntityName]: (...args: Identifier[]) => Plain<K> };

    // readonly divisionIds = idArray();
    readonly divisionIds = linkedArray("division", this.creatorFns.division);

    constructor() {
        void this.network
            .pages("division", { properties: [] })
            .then((divisionIds) => this.divisionIds.set(divisionIds));
    }

    linkedArray<T extends EntityName>(entityName: T, ...args: Parameters<this["creatorFns"][T]>) {
        const creatorFn = this.creatorFns[entityName] as (...args: Identifier[]) => Plain<T>;
        return linkedArray(entityName, () => creatorFn(...(args as unknown as Identifier[])), this.network);
    }

    delete(entityName: EntityName, id: Identifier) {
        return this.network.delete(entityName, id);
    }

    // Alias for DX
    create<T extends EntityName>(entityName: T, initializer: Plain<T>) {
        return this.network.create(entityName, initializer);
    }

    newDivision(): Plain<"division"> {
        return {
            title: "New division",
            description: "Description of the division",
            product: "Final Valuable Product that the division produces",
            offices: [],
        };
    }

    newOffice(division: Identifier): Plain<"office"> {
        return {
            title: "New office",
            description: "Description of the office",
            product: "Final Valuable Product that the office produces",
            division,
            branches: [],
        };
    }

    newBranch(office: Identifier): Plain<"branch"> {
        return {
            title: "New branch",
            description: "Description of the branch",
            product: "Final Valuable Product that the branch produces",
            office,
            tasks: [],
        };
    }

    newTask(branch: Identifier): Plain<"task"> {
        return {
            title: "New task",
            description: "Description of the task",
            product: "Final Valuable Product that the task produces",
            branch,
        };
    }

    // // Takes an identifier, returns a signal that will be initialized with the item from the network request
    // lazyGet<T extends ItemType>(
    //     type: T,
    //     id: Identifier,
    //     {
    //         initializer,
    //         autoInitialize = true,
    //     }: { initializer?: Initializer<ItemObject<T>>; autoInitialize?: boolean } = {},
    // ): Lazy<ItemObject<T> & Identifier & { type: T }> {
    //     // If initial value is provided, replace arrays with lazy collections
    //     const replaced = initializer ? this.replaceArraysWithLazyCollections(initializer, []) : undefined;
    //     const withIdAndType = replaced ? { ...replaced, ...id, type } : undefined;
    //     const s = signal(withIdAndType);

    //     if (autoInitialize)
    //         void (async () => {
    //             const item = await this.network.get(type, id);
    //             // const replaced = this.replaceArraysWithLazyCollections
    //             // s.set(this.proxify(item));
    //             s.set(this.proxify(item) as unknown as LazifiedFields<ItemObject<T>> & Identifier & { type: T });
    //         })();

    //     return s as Lazy<ItemObject<T> & Identifier & { type: T }>;
    // }

    // replaceArraysWithLazyCollections<T, Ctx extends unknown[]>(
    //     initializer: Initializer<T, Ctx>,
    //     context: Ctx,
    // ): LazifiedFields<T> {
    //     // First, we create a copy of the initial value
    //     const result = { ...initializer.value } as LazifiedFields<T>;

    //     // Then, we go through all the fields and replace arrays with lazy collections
    //     if ("initializers" in initializer) {
    //         const nextContext = [result, ...context] as [T, ...Ctx];
    //         for (const [key, value] of Object.entries(initializer.initializers)) {
    //             const { type, initializer: nextInitializer } = value(...nextContext);
    //             // @ts-expect-error - TS doesn't understand that `key` is a key of `T`
    //             result[key] = this.lazyArray(type, {
    //                 initializer: nextInitializer,
    //             });
    //         }
    //     }

    //     return result;
    // }

    // lazyCreate<T extends ItemType>(
    //     type: T,
    //     initializer: Initializer<ItemObject<T>>,
    // ): Lazy<ItemObject<T> & Identifier & { type: T }> {
    //     const arrayKeys = "initializers" in initializer ? Object.keys(initializer.initializers) : [];
    //     const replaced = this.replaceArraysWithLazyCollections(initializer, []);
    //     const withIdAndType = { ...replaced, type, id: "" };
    //     const item = signal(withIdAndType);

    //     function refs2id<TT>(value: TT): Refs2Id<TT> {
    //         return Object.fromEntries(
    //             Object.entries(value).map(([key, value]) => [
    //                 key,
    //                 Array.isArray(value)
    //                     ? value.map(refs2id)
    //                     : value && typeof value === "object" && "id" in value
    //                       ? { id: value.id }
    //                       : value,
    //             ]),
    //         ) as Refs2Id<TT>;
    //     }

    //     void this.network
    //         .create(
    //             type,
    //             refs2id({
    //                 ...initializer.value,
    //                 ...Object.fromEntries(arrayKeys.map((key) => [key, []])),
    //             } as unknown as ItemObject<T>),
    //         )
    //         .then(({ id }) => (item()!.id = id));

    //     return item as Lazy<ItemObject<T> & Identifier & { type: T }>;
    // }

    // lazyArray<T extends ItemType, TInitializer extends Initializer<ItemObject<T>>>(
    //     type: T,
    //     options: {
    //         ids?: Identifier[];
    //         initializer: TInitializer;
    //     },
    // ): LazyArray<ItemObject<T>> {
    //     type R = Lazy<ItemObject<T> & Identifier & { type: T }>;
    //     const s = signal(undefined as R[] | undefined);

    //     if (options.ids) s.set(options.ids.map((id) => this.lazyGet(type, id)));
    //     else void this.network.pages(type, {}).then((ids) => s.set(ids.map((id) => this.lazyGet(type, id))));

    //     async function waitForId(item: R): Promise<string> {
    //         await delayUntil(() => {
    //             const id = item()?.id;
    //             return id !== undefined && id !== "";
    //         });

    //         return item()!.id as string;
    //     }

    //     const add = () => {
    //         const initializer = options.initializer;
    //         const item = this.lazyCreate(type, initializer);
    //         s.update((objects) => [...(objects ?? []), item]);
    //     };

    //     const remove = async (item: R | Identifier) => {
    //         s.update((items) => items?.filter((i) => i !== item));
    //         const id = "id" in item ? item.id : await waitForId(item);
    //         void this.network.delete(type, { id });
    //     };

    //     Reflect.set(s, "add", add);
    //     Reflect.set(s, "remove", remove);

    //     return s as unknown as LazyArray<ItemObject<T>>;
    // }

    // /** Wraps an object with a proxy that tracks dirty properties and then sends update requests back to the server */
    // proxify<T extends ItemType>(object: DBEntry<T>, { updateTimeout = 1000 } = {}) {
    //     type Key = keyof DBEntry<T>;

    //     const dirtyProperties = new Set<Key>();
    //     let timeoutId = 0;

    //     const update = () => {
    //         if (object.id === "") {
    //             scheduleUpdate();
    //             return;
    //         }

    //         void this.network.update<T>(object.type, {
    //             id: object.id,
    //             ...(Object.fromEntries([...dirtyProperties.values()].map((p) => [p, object[p]])) as unknown as Partial<
    //                 Refs2Id<ItemObject<T>>
    //             >),
    //         });

    //         dirtyProperties.clear();
    //     };

    //     const scheduleUpdate = () => {
    //         timeoutId = window.setTimeout(() => {
    //             timeoutId = 0;
    //             update();
    //         }, updateTimeout);
    //     };

    //     return new Proxy(object, {
    //         set(target, prop, value) {
    //             const oldValue = Reflect.get(target, prop);
    //             if (oldValue === value) return true;

    //             if (prop === "id") {
    //                 Reflect.set(target, prop, value);
    //                 return true;
    //             }

    //             dirtyProperties.add(prop as Key);

    //             if (timeoutId !== 0) window.clearTimeout(timeoutId);

    //             scheduleUpdate();

    //             return Reflect.set(target, prop, value);
    //         },
    //     });
    // }
}
