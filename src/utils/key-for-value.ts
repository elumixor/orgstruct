export type KeyForValue<T, V> = Exclude<{ [K in keyof T]: T[K] extends V ? K : never }[keyof T], undefined>;
