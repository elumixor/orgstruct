export type Public<T, TBases extends unknown[] = []> = Pick<T, Exclude<keyof T, KeysOf<TBases>>>;

/** Gather all keys of these bases */
export type KeysOf<TBases extends unknown[]> = TBases extends []
    ? never
    : TBases extends [infer TBase, ...infer TRest]
    ? keyof TBase | KeysOf<TRest>
    : never;
