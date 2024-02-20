import { zip } from "../zip";

export {};

declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface ReadonlyArray<T> {
        /**
         * Returns a first element of an array
         */
        first: T;
        /**
         * Returns a first element of an array
         */
        second: T;
        /**
         * Returns a last element of an array
         */
        last: T;
        /**
         * True if the array is empty
         */
        get isEmpty(): boolean;
        /**
         * True if the array is not empty
         */
        get nonEmpty(): boolean;
        /**
         * Sums all elements of an array
         */
        get sum(): number;
        /**
         * Multiplies all elements of an array
         */
        get prod(): number;
        /**
         * Returns an array where each element is a sum of all elements up to that index
         */
        get cumsum(): number[];
        /**
         * Transposes a 2D array. Returns a new array.
         */
        get transposed(): T[];
        /**
         * Returns an element at the specified index. Indexes can be negative.
         * @param index Index of an element
         */
        get(index: number): T;
        /**
         * Element-wise addition of two arrays
         * @param other Array to add
         */
        add(other: readonly T[]): T[];
        /**
         * Element-wise subtraction of two arrays
         * @param other Array to subtract
         */
        sub(other: readonly T[]): T[];
        /**
         * Returns `n` first elements from array
         */
        take(n: number): T[];
        /**
         * Skips `n` first elements from array and returns the remaining elements
         */
        skip(n: number): T[];
        /**
         * Returns `n` last elements from array
         */
        takeLast(n: number): T[];
        /**
         * Count the number of occurrences of an element in an array
         */
        count(element: T): number;
        /**
         * Returns a generator of random items without repetition
         */
        get shuffled(): Generator<T>;
        /**
         * Picks a random item from the array
         * @returns A random item from the array
         */
        pick(): T;
        /**
         * Picks `n` number from array with repetitions
         * @returns An array of `n` items randomly sampled
         */
        pick(n: number): T[];
        /**
         * Picks `n` number from array with repetitions
         * @returns A generator of random items without repetition
         */
        pick(n: number, options: { lazy: true }): Generator<T>;
        /**
         * Picks `n` number from array without repetitions
         * @returns An array of `n` items randomly sampled without repetition
         */
        pick(n: number, options: { repeat: false }): T[];
        /**
         * Picks `n` number from array without repetitions
         * @returns A generator of random items without repetition
         */
        pick(n: number, options: { repeat: false; lazy: true }): Generator<T>;
        /**
         * Like {@link map} but returns a generator
         */
        mapLazy<U>(callback: (value: T, index: number, array: T[]) => U): Generator<U>;
        /**
         * Returns a new array with unique elements only.
         *
         * By default compares using `===`, optionally takes a comparator function.
         */
        unique(comparator?: (a: T, b: T) => boolean): T[];
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
    interface Array<T> extends ReadonlyArray<T> {
        /**
         * Removes the first occurrence of the given element from the array.
         * @param element The element to remove.
         */
        remove(...element: T[]): void;
        /**
         * Sets the given element at the given index. Index can be negative.
         * @param index The index to set the element at.
         * @param value The element to set.
         */
        set(index: number, value: T): void;
        /**
         * Removes an element at the specified index
         */
        removeAt(index: number): void;
        /**
         * Inserts an element at the specified index
         */
        insertAt(element: T, index: number): void;
        /**
         * Shuffles an array in-place
         * @returns The modified array
         */
        shuffle(): this;
        /**
         * Clears the array
         */
        clear(): void;
    }
}

Reflect.defineProperty(Array.prototype, "first", {
    get(this: unknown[]) {
        return this[0];
    },
    set<T>(this: unknown[], value: T) {
        this[0] = value;
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "second", {
    get(this: unknown[]) {
        return this[1];
    },
    set<T>(this: unknown[], value: T) {
        this[1] = value;
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "last", {
    get(this: unknown[]) {
        return this[this.length - 1];
    },
    set<T>(this: unknown[], value: T) {
        this[this.length - 1] = value;
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "isEmpty", {
    get(this: unknown[]) {
        return this.length < 1;
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "nonEmpty", {
    get(this: unknown[]) {
        return this.length > 0;
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "remove", {
    value(this: unknown[], ...elements: unknown[]) {
        for (const element of elements) {
            const index = this.indexOf(element);
            if (index < 0) return;
            this.splice(index, 1);
        }
    },
    writable: false,
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "sum", {
    get(this: number[]) {
        let result = 0;

        for (const element of this) result += element;

        return result;
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "prod", {
    get(this: number[]) {
        let result = 1;

        for (const element of this) result *= element;

        return result;
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "cumsum", {
    get(this: number[]) {
        let current = 0;

        return this.map((element) => {
            current += element;
            return current;
        });
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "transposed", {
    get<T>(this: T[][]) {
        return Array.from(zip(...this));
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "get", {
    value(this: unknown[], index: number) {
        if (index >= 0) return this[index];

        return this[this.length + index];
    },
    writable: false,
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "set", {
    value<T>(this: T[], index: number, value: T) {
        this[index >= 0 ? index : this.length + index] = value;
    },
    writable: false,
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "add", {
    value(this: number[], other: number[]) {
        if (other.length !== this.length) throw new Error("Can only add arrays of the same length");

        const result: number[] = [];
        for (let i = 0; i < this.length; i++) result[i] = this[i] + other[i];

        return result;
    },
    writable: false,
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "sub", {
    value(this: number[], other: number[]) {
        if (other.length !== this.length) throw new Error("Can only subtract arrays of the same length");

        const result: number[] = [];
        for (let i = 0; i < this.length; i++) result[i] = this[i] - other[i];

        return result;
    },
    writable: false,
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "removeAt", {
    value(this: unknown[], index: number) {
        this.splice(index, 1);
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "insertAt", {
    value(this: unknown[], element: unknown, index: number) {
        this.splice(index, 0, element);
    },
    configurable: true,
});

/* istanbul ignore next */
Reflect.defineProperty(Array.prototype, "shuffled", {
    *get<T>(this: T[]): Iterable<T> {
        const copy = [...this];

        let i = this.length;

        while (i--) yield copy.splice(Math.floor(Math.random() * (i + 1)), 1)[0];

        return;
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "shuffle", {
    value(this: unknown[]) {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            // swap randomly chosen element with current element
            [this[i], this[j]] = [this[j], this[i]];
        }

        return this;
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "pick", {
    value<T>(this: T[], n?: number, { repeat = true, lazy = false } = {}) {
        if (n === undefined) return this[Math.floor(Math.random() * this.length)];

        if (repeat) {
            const generator = (function* (array: T[]) {
                for (let i = 0; i < n; i++) yield array[Math.floor(Math.random() * array.length)];
            })(this);

            return lazy ? generator : generator.toArray();
        }

        if (n > this.length) throw new Error("Cannot pick (without repetition) more numbers then there are in array");

        const generator = this.shuffled.take(n);

        return lazy ? generator : generator.toArray();
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "mapLazy", {
    *value<T, U>(this: T[], callback: (value: T, index: number, array: T[]) => U) {
        for (let i = 0; i < this.length; i++) yield callback(this[i], i, this);
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "unique", {
    value<T>(this: T[], comparator = (a: T, b: T) => a === b) {
        const result = new Array<T>();

        // Go through the array...
        // If there is no such element in result
        for (const current of this)
            if (!result.some((resultElement) => comparator(current, resultElement)))
                // Then add the current element to the result
                result.push(current);

        return result;
    },
});

Reflect.defineProperty(Array.prototype, "take", {
    value<T>(this: readonly T[], n: number) {
        return this.slice(0, n);
    },
    configurable: true,
});

Reflect.defineProperty(Array.prototype, "skip", {
    value<T>(this: readonly T[], n: number) {
        return this.slice(n);
    },
});

Reflect.defineProperty(Array.prototype, "takeLast", {
    value<T>(this: readonly T[], n: number) {
        return this.slice(-n);
    },
});

Reflect.defineProperty(Array.prototype, "count", {
    value<T>(this: readonly T[], element: T) {
        let total = 0;
        for (const arrayElement of this) if (arrayElement === element) total++;
        return total;
    },
});

Reflect.defineProperty(Array.prototype, "clear", {
    value(this: unknown[]) {
        this.splice(0, this.length);
    },
    configurable: true,
});
