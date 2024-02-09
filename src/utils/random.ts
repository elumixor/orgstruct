/** Generates a random number in [0, 1) range */
export function random(): number;
/** Generates a random number in [0, max) range. Returns an integer.  */
export function random(max: number): number;
/** Generates a random number in [min, max) range. Returns an integer.  */
export function random(min: number, max: number): number;
export function random(from?: number, to?: number) {
    if (from === undefined) return Math.random();
    if (to === undefined) {
        to = from;
        from = 0;
    }
    return Math.floor(randomFloat(from, to));
}

/** Generates a random floating point number in [0, max) range. */
export function randomFloat(max: number): number;
/** Generates a random floating point number in [min, max) range. */
export function randomFloat(min: number, max: number): number;
export function randomFloat(from: number, to?: number) {
    if (to === undefined) {
        to = from;
        from = 0;
    }
    return Math.random() * (to - from) + from;
}

/** Generates a random string of given length. */
export function randomString(length: number = 10, _alphabet = alphabet) {
    return Array.from({ length }, () => randomChar(_alphabet)).join("");
}

/** Generates a random character */
export function randomChar(_alphabet = alphabet) {
    return alphabet[random(alphabet.length)];
}

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
