import { effect, signal, type Signal, type WritableSignal } from "@angular/core";

let localStorage: Storage;
try {
    localStorage = window.localStorage;
} catch {
    const s = {
        _storage: {} as Record<string, string>,
        getItem(key: string) {
            return this._storage[key];
        },
        setItem(key: string, value: string) {
            this._storage[key] = value;
        },
    };
    localStorage = s as unknown as Storage;
}

export function localStorageGet<T = unknown>(key: string, mapper?: (value: unknown) => unknown) {
    const value = localStorage.getItem(key);
    if (!value) return;
    try {
        const parsed = JSON.parse(value) as T;
        return mapper ? (mapper(parsed) as T) : parsed;
    } catch {
        return;
    }
}

export function localStorageSet(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
}

interface Options {
    mapper: (value: unknown) => unknown;
}

export function locallyStored<T extends WritableSignal<unknown>>(
    key: string,
    initializer: T,
    options?: Options,
): T & { save(): void };
export function locallyStored<T>(key: string, initializer: T, options?: Options): WritableSignal<T> & { save(): void };
export function locallyStored<T extends Signal<unknown>>(
    key: string,
    initializer: T | WritableSignal<T>,
    options?: Options,
) {
    const isSignal = typeof initializer === "function";
    if (isSignal) {
        const sig = initializer as WritableSignal<T>;
        const saved = localStorageGet<T | undefined>(key, options?.mapper);
        if (saved !== undefined) sig.set(saved);

        effect(() => {
            const newValue = sig();
            localStorageSet(key, newValue);
        });

        Reflect.defineProperty(sig, "save", {
            value() {
                localStorageSet(key, sig());
            },
        });

        return sig;
    }

    const sig = signal(localStorageGet<T>(key, options?.mapper) ?? initializer);
    effect(() => localStorageSet(key, sig()));

    Reflect.defineProperty(sig, "save", {
        value() {
            localStorageSet(key, sig());
        },
    });

    return sig;
}
