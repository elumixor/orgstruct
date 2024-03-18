export function lazy<T>(fn: () => PromiseLike<T>) {
    let currentValue: T | undefined;
    let inProgress = false;
    let currentPromise: PromiseLike<T> | undefined;

    return {
        async get() {
            if (currentValue !== undefined) return currentValue;
            if (inProgress) return currentPromise!;

            currentPromise = fn();
            inProgress = true;

            try {
                return currentPromise;
            } finally {
                inProgress = false;
            }
        },
        refresh() {
            currentValue = undefined;
            return this.get();
        },
    };
}
