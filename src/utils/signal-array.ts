import { signal } from "@angular/core";

/**
 * DX utility for working with signals that represent arrays.
 * Basically adds `add` and `remove` methods to the signal.
 */
export function signalArray<T = unknown>(equalityOp = (a: unknown, b: unknown) => a === b) {
    const sig = signal([] as T[]);
    const remove = (value: T) => sig.update((current) => current.filter((item) => !equalityOp(item, value)));
    const add = (...value: T[]) => sig.update((items) => [...items, ...value]);
    Reflect.defineProperty(sig, "remove", { value: remove, writable: true });
    Reflect.defineProperty(sig, "add", { value: add, writable: true });
    return sig as typeof sig & {
        remove: typeof remove;
        add: typeof add;
    };
}

export type SignalArray<T = unknown> = ReturnType<typeof signalArray<T>>;
