import { signal, type Signal } from "@angular/core";
import type { KeyForValue } from "@utils";

type Rec = Record<string, unknown>;

// Signal that provides `undefined` in the beginning, and then a value of `T` after initialization
export type LazyObject<T> = Signal<T | undefined>;

// A signal that provides `undefined` in the beginning, and then an array of `Lazy<T>` items
// notice that this is deep recursive lazification
export type LazyArray<T> = Signal<Lazified<T>[] | undefined> & {
    add(): void;
    remove(item: T): void;
};

type LazifiedFields<T> = {
    [P in keyof T]: T[P] extends (infer U)[] ? LazyArray<U> : T[P];
};

/// Transforms an object by:
// - First arrays are replayed with lazy arrays
// - Then the whole object is wrapped in a signal
export type Lazified<T> = LazyObject<LazifiedFields<T>>;

export function lazify<T extends Record<string, unknown>>(value: T): Lazified<T> {
    // Split the object into
}

function getArrayProperties<T>(value: T) {
    return Object.fromEntries(Object.entries(value).filter(([, v]) => Array.isArray(v))) as {
        [K in { [P in keyof T]: T[P] extends unknown[] ? P : never }[keyof T]]: T[K];
    };
}

function getNonArrayProperties<T>(value: T) {
    return Object.fromEntries(Object.entries(value).filter(([, v]) => !Array.isArray(v))) as {
        [K in { [P in keyof T]: T[P] extends unknown[] ? never : P }[keyof T]]: T[K];
    };
}

const arrayProps = getArrayProperties({ a: 1, b: [1, 2], c: [3, 4] });
//     ^?

const nonArrayProps = getNonArrayProperties({ a: 1, b: [1, 2], c: [3, 4] });
//     ^?
