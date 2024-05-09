import { signal, type WritableSignal } from "@angular/core";

export function fromPromise<T>(promise: PromiseLike<T>): WritableSignal<T | undefined>;
export function fromPromise<T>(promise: PromiseLike<T>, defaultValue: T): WritableSignal<T>;
export function fromPromise<T>(promise: PromiseLike<T>, defaultValue?: T) {
    const sig = signal(defaultValue);
    void promise.then((v) => sig.set(v));
    return sig;
}
