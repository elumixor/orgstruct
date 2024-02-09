export function* zip<T extends unknown[]>(...toZip: { [K in keyof T]: Iterable<T[K]> }): Generator<T> {
    // Get iterators for all the iterables.
    const iterators = toZip.map((i) => i[Symbol.iterator]());

    if (iterators.length === 0) return;

    while (true) {
        // Advance all the iterators.
        const results = iterators.map((i) => i.next());

        // If any of the iterators are done, we should stop.
        if (results.some(({ done }) => done)) break;

        // We can assert the yield type, since we know none
        // of the iterators are done.
        yield results.map(({ value }) => value as T[keyof T]) as T;
    }
}
