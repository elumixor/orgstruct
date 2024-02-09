export type Unpromisify<T> =
    T extends PromiseLike<infer U>
        ? U
        : T extends (...args: infer R) => PromiseLike<infer U>
          ? (...args: R) => U
          : never;
