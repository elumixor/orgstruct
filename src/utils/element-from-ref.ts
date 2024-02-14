import { ElementRef } from "@angular/core";

export type RefProvider<T extends HTMLElement = HTMLElement> = T | ElementRef<T> | { element: ElementRef<T> };
export type RefProviderOptional<T extends HTMLElement = HTMLElement> =
    | T
    | undefined
    | ElementRef<T | undefined>
    | { element?: ElementRef<T | undefined> };

export function elementFromRef<T extends HTMLElement, R extends RefProviderOptional<T>>(
    ref: R,
): R extends RefProvider<T> ? T : T | undefined {
    type Return = R extends RefProvider<T> ? T : T | undefined;

    if (!ref) return undefined as Return;
    if (ref instanceof ElementRef) return ref.nativeElement as Return;
    if ("element" in ref) return ref.element?.nativeElement as Return;
    return ref as unknown as Return;
}
