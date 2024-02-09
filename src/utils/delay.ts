export function delay(seconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

export function delayUntil(predicate: () => boolean, interval = 100) {
    return new Promise<void>((resolve) => {
        const i = setInterval(() => {
            if (predicate()) {
                clearInterval(i);
                resolve();
            }
        }, interval);
    });
}
