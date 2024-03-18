export {};

declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface String {
        capitalize(): string;
    }
}

Reflect.defineProperty(String.prototype, "capitalize", {
    value(this: string) {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
});
