export function snapped(value: number, gridSize: number) {
    return Math.round(value / gridSize) * gridSize;
}

export function snappedVal(initialValue: number, gridSize: number) {
    return {
        unsnapped: initialValue,
        get value() {
            return snapped(this.unsnapped, gridSize);
        },
        set value(value: number) {
            this.unsnapped = value;
        },
    };
}
