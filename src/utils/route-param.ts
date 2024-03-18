import { inject, signal, type Signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

export function routeParam(key: string, defaultValue: string): Signal<string>;
export function routeParam<T>(key: string, defaultValue: T, transform: (value: string) => T): Signal<T>;
export function routeParam(
    key: string,
    defaultValue: unknown,
    transform?: (value: string) => unknown,
): Signal<unknown> {
    const activatedRoute = inject(ActivatedRoute);
    const sig = signal(defaultValue);

    activatedRoute.paramMap.subscribe((params) => {
        const value = params.get(key);
        if (value === null) return;
        const transformed = transform ? transform(value) : value;
        sig.set(transformed);
    });

    return sig;
}
