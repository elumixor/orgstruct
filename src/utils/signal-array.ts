import { signal } from "@angular/core";

/**
 * DX utility for working with signals that represent arrays.
 * Basically adds `add` and `remove` methods to the signal.
 */
export function signalArray<T = unknown>(equalityOp = (a: unknown, b: unknown) => a === b) {
    const sig = signal([] as T[]);
    const remove = (value: T) => sig.update((current) => current.filter((item) => !equalityOp(item, value)));
    const push = (...value: T[]) => sig.update((items) => [...items, ...value]);
    Reflect.defineProperty(sig, "remove", { value: remove, writable: true });
    Reflect.defineProperty(sig, "push", { value: push, writable: true });
    return sig as typeof sig & {
        remove: typeof remove;
        push: typeof push;
    };
}

export type SignalArray<T = unknown> = ReturnType<typeof signalArray<T>>;
