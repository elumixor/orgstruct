export function gettable<T>(fn: () => Promise<T>) {
    let inProgress = false;
    let currentPromise: Promise<T>;

    return {
        get() {
            if (inProgress) return currentPromise;
            inProgress = true;
            currentPromise = fn();
            currentPromise.finally(() => (inProgress = false));
            return currentPromise;
        },
    };
}
