export type Point = [number, number] & {
    x: number;
    y: number;
    copy(): Point;
};

export type PointArgs = [number, number] | number | { x: number; y: number } | undefined;

export function round(value: number, precision = 2) {
    const factor = 10 ** precision;
    return Math.round(value * factor) / factor;
}

export function Point(args?: PointArgs): Point;
export function Point(x: number, y: number): Point;
export function Point(...args: unknown[]): Point {
    // Parse arguments
    let x: number;
    let y: number;

    if (args.length === 0) {
        x = 0;
        y = 0;
    } else if (args.length === 1 && Array.isArray(args[0])) {
        [x, y] = args[0] as [number, number];
    } else if (args.length === 1 && typeof args[0] === "number") {
        x = args[0];
        y = args[0];
    } else if (args.length === 1) {
        ({ x, y } = args[0] as { x: number; y: number });
    } else if (args.length === 2) {
        [x, y] = args as [number, number];
    } else throw new Error(`Invalid arguments ${String(args)}`);

    const copy = () => Point(...result);
    const toString = () => `(${round(result[0])}, ${round(result[1])})`;

    // Create a proxy object to allow accessing via "x" and "y" properties
    const result = new Proxy([x, y], {
        get(target, prop) {
            if (prop === "x") return target[0];
            if (prop === "y") return target[1];
            if (prop === "copy") return copy;
            if (prop === "toString") return toString;
            return Reflect.get(target, prop) as number;
        },
        set(target, prop, value) {
            if (prop === "x") target[0] = value as number;
            if (prop === "y") target[1] = value as number;
            return true;
        },
    }) as Point;

    return result;
}

export function PointDeserialize(value: unknown): Point {
    if (typeof value !== "object" || value === null) throw new Error(`Invalid value ${String(value)}`);
    const x = Reflect.get(value, "0") as number | undefined;
    if (x === undefined) throw new Error(`Invalid value ${String(value)}`);
    const y = Reflect.get(value, "1") as number | undefined;
    if (y === undefined) throw new Error(`Invalid value ${String(value)}`);
    return Point(x, y);
}

// export function namedTuple<T extends [string, unknown][]>(initializers: T) {
//     const keyToIndex = new Map(initializers.map(([key], index) => [key, index]));

//     const result = new Proxy({}, {});

//     return result;
// }
