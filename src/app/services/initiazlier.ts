import type { ArrayElement, KeyForValue } from "@utils";

// interface A {
//     title: string;
//     bs: B[];
// }

// interface B {
//     a: A;
//     title: string;
//     description: string;
// }
// This is the resulting type we want to obtain
//

// Properties that are arrays
//
type NestedArrays<T> = Pick<T, KeyForValue<T, unknown[]>>;
//
// Examples
// type NestedA = NestedArrays<A>;
//   ^?
// type NestedB = NestedArrays<B>;
//   ^?

// Plain properties which are not inner arrays
//
type NonNested<T> = Omit<T, KeyForValue<T, unknown[]>>;
//
// Examples
// type PlainA = NonNested<A>;
//   ^?
// type PlainB = NonNested<B>;
//   ^?

// Initializer
//
export type Initializer<T = unknown, Ctx extends unknown[] = []> = Cleanup<{
    // Provide default values for plain properties
    value: NonNested<T>;
    // Next, recursively provide initialization for nested arrays
    initializers: {
        // They depend on the context, thus we provide a function
        [P in keyof NestedArrays<T>]: InitializerFn<ArrayElement<T[P]>, [T, ...Ctx]>;
    };
}>;
export type InitializerFn<T, Ctx extends unknown[] = []> = (...context: Ctx) => {
    type: string;
    initializer: Initializer<T, Ctx>;
};

// With this small utility, we can remove the `initializers` property if it's empty
//
type Cleanup<T extends { initializers: object }> =
    T["initializers"] extends Record<string, never> ? Omit<T, "initializers"> : T;

// type Cleanup<T extends { initializers: object }> = T;

// Example
//
// this function should provide necessary validation
// function acceptInitializer<T>(initializer: Initializer<T>) {
//     // ...
//     // eslint-disable-next-line no-console
//     console.log(initializer);
// }
//
// Here we call it with a correct initializer
// acceptInitializer<A>({
//     value: {
//         title: "",
//     },
//     initializers: {
//         bs(a: A): Initializer<B> {
//             return {
//                 value: {
//                     a,
//                     title: "",
//                     description: "",
//                 },
//             };
//         },
//     },
// });
