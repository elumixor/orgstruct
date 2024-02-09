export {};

declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
    interface Iterator<T, TReturn = any, TNext = undefined> {
        map<U>(fn: (value: T, index: number) => U): Generator<U>;
        filter(fn: (value: T, index: number) => boolean): Generator<T>;
        toArray(): T[];
        take(n: number): Generator<T>;
    }
}

Reflect.defineProperty(Object.prototype, "map", {
    *value<T, U>(this: Iterator<T>, fn: (value: T, index: number) => U): Generator<U> {
        let index = 0;
        let { value, done } = this.next() as { value?: T; done: boolean };
        while (!done) {
            yield fn(value as T, index++);

            ({ value, done } = this.next() as { value?: T; done: boolean });
        }
    },
    enumerable: false,
    configurable: true,
    writable: true,
});

Reflect.defineProperty(Object.prototype, "toArray", {
    value<T>(this: Iterator<T>): T[] {
        const result = new Array<T>();
        let { value, done } = this.next() as { value?: T; done: boolean };

        while (!done) {
            result.push(value as T);

            ({ value, done } = this.next() as { value?: T; done: boolean });
        }

        return result;
    },
    configurable: true,
    writable: true,
});

Reflect.defineProperty(Object.prototype, "take", {
    *value<T>(this: Iterator<T>, n: number): Generator<T> {
        let index = 0;
        let { value, done } = this.next() as { value?: T; done: boolean };
        while (!done && index < n) {
            yield value as T;

            ({ value, done } = this.next() as { value?: T; done: boolean });
            index++;
        }
    },
    configurable: true,
});
