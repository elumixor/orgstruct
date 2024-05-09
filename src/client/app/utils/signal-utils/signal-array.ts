import { signal } from "@angular/core";

export function signalArray<T>() {
    const sig = signal([] as T[]);

    const push = (...values: T[]) => sig.update((v) => [...v, ...values]);
    const remove = (value: T) => sig.update((v) => v.filter((v1) => v1 !== value));
    const updateMap = (mapper: (value: T) => T) => sig.update((v) => v.map(mapper));

    Reflect.defineProperty(sig, "push", { value: push });
    Reflect.defineProperty(sig, "remove", { value: remove });
    Reflect.defineProperty(sig, "updateMap", { value: updateMap });

    return sig as typeof sig & { push: typeof push; remove: typeof remove; updateMap: typeof updateMap };
}
