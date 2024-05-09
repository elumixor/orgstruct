import { signal } from "@angular/core";

export function signalSet<T>() {
    const sig = signal(new Set<T>());

    // Define some methods
    const update = () => sig.update((v) => new Set(v));
    const add = (value: T) => {
        sig().add(value);
        update();
    };
    const deleteFn = (value: T) => {
        sig().delete(value);
        update();
    };
    const toggle = (value: T) => {
        sig().toggle(value);
        update();
    };

    Reflect.defineProperty(sig, "add", { value: add });
    Reflect.defineProperty(sig, "delete", { value: deleteFn });
    Reflect.defineProperty(sig, "toggle", { value: toggle });

    return sig as typeof sig & { add: typeof add; delete: typeof deleteFn; toggle: typeof toggle };
}
