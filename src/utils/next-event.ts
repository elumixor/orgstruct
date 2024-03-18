import type { EventEmitter } from "@angular/core";

export function nextEvent<T>(eventEmitter: EventEmitter<T>) {
    return new Promise<T>((resolve) => {
        const subscription = eventEmitter.subscribe((value) => {
            resolve(value);
            subscription.unsubscribe();
        });
    });
}
