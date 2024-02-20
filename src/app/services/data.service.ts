import { Injectable, computed, effect, inject, signal, type Signal, type WritableSignal } from "@angular/core";
import type { EntityName, Identifier, MetaPlain, Plain } from "@domain";
import { pick, signalArray } from "@utils";
import { NetworkService } from "./network.service";

export function syncArrays<T extends EntityName>(
    sig: Signal<Lazy<T>[] | undefined>,
    getArray: () => Identifier[] | undefined,
) {
    effect(() => {
        const signals = sig();
        const array = getArray();

        if (!signals) return;
        if (!array) throw new Error("syncArrays(): Array must be set before offices change");

        // Add new offices to division.offices or remove the deleted ones
        array.clear();
        array.push(...signals.map((sig) => ({ id: sig()?.id ?? "" })));
    });
}

@Injectable({
    providedIn: "root",
})
export class DataService {
    private readonly network = inject(NetworkService);

    /** Creates a new proxy object from the id, will then get the remaining data from the network */
    from<T extends EntityName>(entityName: T, id: Identifier): Lazy<T>;
    /** Creates a new proxy object using initial data, creates an object on the backend and then assigns correct id */
    from<T extends EntityName>(entityName: T, initializer: Plain<T>): Lazy<T>;
    /** For DX: strange cases where typescript cannot decide */
    from<T extends EntityName>(entityName: T, idOrInitializer: Identifier | Plain<T>): Lazy<T>;
    from<T extends EntityName>(entityName: T, idOrInitializer: Identifier | Plain<T>): Lazy<T> {
        const hasData = !("id" in idOrInitializer);
        const sig = signal(hasData ? { ...idOrInitializer, id: "", type: entityName } : undefined);
        let initialized = false;
        let initializationPromise = new Promise<void>(() => undefined);

        if (hasData)
            initializationPromise = this.network.create(entityName, idOrInitializer).then((id) => {
                sig.set({ ...idOrInitializer, ...id, type: entityName });
            });
        else
            initializationPromise = this.network.get(entityName, idOrInitializer).then((item) => {
                sig.set(item);
            });

        void initializationPromise.then(() => (initialized = true));

        Reflect.defineProperty(sig, initializedSymbol, { get: () => initialized });
        Reflect.defineProperty(sig, initializationPromiseSymbol, { get: () => initializationPromise });

        return sig as unknown as Lazy<T>;
    }

    lazify<T extends EntityName>(entity: Lazy<T>, { updateTimeout = 1000 } = {}): Lazy<T> {
        // Return a signal that will proxify the returned value
        const sig = computed(() => {
            const value = entity();
            return value ? proxifyObject(value) : value;
        });

        // Also return the initialized flag to be compatible with the original Proxy
        Reflect.defineProperty(sig, initializedSymbol, { get: () => entity[initializedSymbol] });
        Reflect.defineProperty(sig, initializationPromiseSymbol, { value: entity[initializationPromiseSymbol] });

        // Set of properties that have change and need to be updated on the server
        const dirtyProperties = new Set<keyof Plain<T>>();

        // Don't update instantly to reduce the number of requests
        // Update after some time has elapsed (e.g. 1 second) after the latest change
        let timeoutId = 0;

        // Flag to prevent multiple updates: we only allow an update to happen if the previous one has finished
        let updateAllowed = true;

        const update = (value: MetaPlain<T>) => {
            // Don't update if the value was not yet initialized - just record the changes
            // Also don't update if the previous update is still pending
            if (!entity[initializedSymbol] || !updateAllowed) {
                scheduleUpdate(value);
                return;
            }

            updateAllowed = false;

            // Actual update
            void this.network
                .update(value.type, { id: value.id, ...pick(value, dirtyProperties) })
                .then(() => (updateAllowed = true));

            dirtyProperties.clear();
        };

        const scheduleUpdate = (value: MetaPlain<T>) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                timeoutId = 0;
                update(value);
            }, updateTimeout);
        };

        const proxifyObject = (obj: MetaPlain<T>): MetaPlain<T> => {
            return new Proxy(obj, {
                set(target, prop, newValue) {
                    // Don't do anything if the value hasn't changed
                    const oldValue = Reflect.get(target, prop);
                    if (oldValue === newValue) return true;

                    // Id and type should not be changed
                    if (prop === "id") throw new Error("Id cannot be updated in the proxy object");
                    if (prop === "type") throw new Error("Type cannot be updated in the proxy object");

                    // Add the key to the set of dirty properties and schedule an update
                    dirtyProperties.add(prop as keyof Plain<T>);
                    scheduleUpdate(target);

                    // Finally, also apply the immediate change to the underlying object
                    return Reflect.set(target, prop, newValue);
                },
                has(target, prop) {
                    // Provide also initialization symbols
                    if (prop === initializedSymbol || prop === initializationPromiseSymbol) return true;
                    return Reflect.has(target, prop);
                },
                get(target, prop) {
                    // Provide also initialization symbols
                    if (prop === initializedSymbol) return entity[initializedSymbol];
                    if (prop === initializationPromiseSymbol) return entity[initializationPromiseSymbol];
                    return Reflect.get(target, prop);
                },
            });
        };

        return sig as Lazy<T>;
    }

    lazifyFrom<T extends EntityName>(entityName: T, idOrInitializer: Identifier | Plain<T>): Lazy<T> {
        return this.lazify(this.from(entityName, idOrInitializer));
    }

    lazifyIds<T extends EntityName>(entityName: T, ids: Identifier[]): Lazy<T>[] {
        return ids.map((id) => this.lazifyFrom(entityName, id));
    }

    arrayOfLazy<T extends EntityName>(entityName: T) {
        // For addition, everything is the same, but we need to override removal in order to delete items on the server
        const result = signalArray<Lazy<T>>();

        const previousRemove = result.remove;

        const remove = async (value: Identifier | Lazy<T>) => {
            if (Reflect.has(value, initializationPromiseSymbol)) await Reflect.get(value, initializationPromiseSymbol);

            // If we have an identifier, then we should already have a valid proxy for it
            if ("id" in value) {
                if (value.id === "")
                    throw new Error("Received an empty id during removal. Maybe try providing a proxy directly?");

                const proxy = result().find((proxy) => proxy()?.id === value.id);
                if (!proxy)
                    throw new Error(
                        `Proxy not found for the given id.\nIds \n\t${result()
                            .map((proxy) => proxy()?.id)
                            .join("\n\t")}\ndid not contain id ${String(value.id)}`,
                    );

                // Remove from array
                previousRemove(proxy);

                // Also remove from the server
                return this.network.delete(entityName, value);
            }

            // Otherwise the situation is a bit more complex: we are removing a proxy directly
            // Which can be uninitialized, in which case we need to wait for the initialization to finish

            // First, we still just remove it from the array
            previousRemove(value);

            // Then we remove it from the server, but only if after the initialization is finished
            void value[initializationPromiseSymbol].then(() => this.network.delete(entityName, value()!));
        };

        Reflect.defineProperty(result, "remove", { value: remove, writable: true });

        return result as unknown as WritableSignal<Lazy<T>[] | undefined> & {
            add: (...value: Lazy<T>[]) => void;
            remove: typeof remove;
        };
    }
}

export type Lazy<T extends EntityName> = Signal<MetaPlain<T> | undefined> & {
    [initializedSymbol]: boolean;
    [initializationPromiseSymbol]: Promise<void>;
};
export const initializedSymbol = Symbol("initialized");
export const initializationPromiseSymbol = Symbol("initializationPromise");
