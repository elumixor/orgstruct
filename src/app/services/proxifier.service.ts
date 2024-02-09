import { Injectable, WritableSignal, signal } from "@angular/core";
import { ItemType, ItemObject, Identifier } from "@domain";
import { DBEntry, Refs2Id, delayUntil } from "@utils";
import { NetworkService } from "./network.service";

export type Lazy<T extends ItemType> = WritableSignal<DBEntry<T> | undefined>;
export type LazyCollection<T extends ItemType> = WritableSignal<Lazy<T>[] | undefined> & {
    add(): void;
    remove(item: Lazy<T> | Identifier): void;
};

interface ProxifyOptions {
    updateTimeout?: number;
}

@Injectable({
    providedIn: "root",
})
export class ProxifierService {
    constructor(private readonly network: NetworkService) {}

    // Takes an identifier, returns a signal that will be initialized with the item from the network request
    lazy<T extends ItemType>(
        type: T,
        id: Identifier,
        options?: { initialValue?: DBEntry<T>; autoInitialize?: boolean } & ProxifyOptions,
    ): Lazy<T> {
        const s = signal<DBEntry<T> | undefined>(options?.initialValue);

        if (options?.autoInitialize ?? true)
            void (async () => {
                if (options?.initialValue) return;
                const item = await this.network.get(type, id);
                s.set(this.proxify(item, options));
            })();

        return s as Lazy<T>;
    }

    lazyCreate<T extends ItemType>(
        type: T,
        options: { initialValue: Refs2Id<ItemObject<T>>; udpateTimeout?: number },
    ): Lazy<T> {
        const item = this.lazy(
            type,
            { id: "" },
            {
                autoInitialize: false,
                initialValue: this.proxify({
                    ...options.initialValue,
                    id: "",
                    type,
                    updateTimeout: options.udpateTimeout,
                }),
            },
        );

        void this.network.create(type, options.initialValue).then(({ id }) => (item()!.id = id));

        return item;
    }

    lazyCollection<T extends ItemType>(
        type: T,
        options: { ids?: Identifier[]; initialValue: Refs2Id<ItemObject<T>> } & ProxifyOptions,
    ): LazyCollection<T> {
        const s = signal(undefined as Lazy<T>[] | undefined);

        if (options.ids) s.set(options.ids.map((id) => this.lazy(type, id)));
        else void this.network.pages(type, {}).then((ids) => s.set(ids.map((id) => this.lazy(type, id))));

        const waitForId = async (item: Lazy<T>) => {
            await delayUntil(() => {
                const id = item()?.id;
                return id !== undefined && id !== "";
            });

            return item()?.id as string;
        };

        const add = () => {
            const item = this.lazyCreate(type, options);
            s.update((objects) => [...(objects ?? []), item]);
        };

        const remove = async (item: Lazy<T> | Identifier) => {
            s.update((items) => items?.filter((i) => i !== item));
            const id = "id" in item ? item.id : await waitForId(item);
            void this.network.delete(type, { id });
        };

        Reflect.set(s, "add", add);
        Reflect.set(s, "remove", remove);

        return s as typeof s & {
            add: typeof add;
            remove: typeof remove;
        };
    }

    /** Wraps an object with a proxy that tracks dirty properties and then sends update reqeusts back to the server */
    proxify<T extends ItemType>(object: DBEntry<T>, { updateTimeout = 1000 }: ProxifyOptions = {}) {
        type Key = keyof DBEntry<T>;

        const dirtyProperties = new Set<Key>();
        let timeoutId = 0;

        const update = () => {
            if (object.id === "") {
                scheduleUpdate();
                return;
            }

            void this.network.update<T>(object.type, {
                id: object.id,
                ...(Object.fromEntries([...dirtyProperties.values()].map((p) => [p, object[p]])) as unknown as Partial<
                    Refs2Id<ItemObject<T>>
                >),
            });

            dirtyProperties.clear();
        };

        const scheduleUpdate = () => {
            timeoutId = window.setTimeout(() => {
                timeoutId = 0;
                void update();
            }, updateTimeout);
        };

        const proxified = new Proxy(object, {
            set(target, prop, value) {
                const oldValue = Reflect.get(target, prop);
                if (oldValue === value) return true;

                if (prop === "id") {
                    Reflect.set(target, prop, value);
                    return true;
                }

                dirtyProperties.add(prop as Key);

                if (timeoutId !== 0) window.clearTimeout(timeoutId);

                scheduleUpdate();

                return Reflect.set(target, prop, value);
            },
        });

        return proxified;
    }
}
