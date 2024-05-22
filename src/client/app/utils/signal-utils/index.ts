import type { Signal } from "@angular/core";

export * from "./from-promise";
export * from "./signal-set";
export * from "./signal-map";
export * from "./signal-array";

export type SignalValue<T extends Signal<unknown>> = T extends Signal<infer U> ? U : never;
