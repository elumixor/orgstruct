import { signal } from "@angular/core";

export function signalMap<K, V>() {
    const sig = signal(new Map<K, V>());

    const update = () => sig.update((v) => new Map(v));
    const get = (key: K) => sig().get(key);
    const setValue = (key: K, value: V) => {
        sig().set(key, value);
        update();
    };
    const deleteFn = (key: K) => {
        sig().delete(key);
        update();
    };
    const has = (key: K) => sig().has(key);

    Reflect.defineProperty(sig, "get", { value: get });
    Reflect.defineProperty(sig, "setValue", { value: setValue });
    Reflect.defineProperty(sig, "has", { value: has });
    Reflect.defineProperty(sig, "delete", { value: deleteFn });

    return sig as typeof sig & { get: typeof get; setValue: typeof setValue; has: typeof has; delete: typeof deleteFn };
}
