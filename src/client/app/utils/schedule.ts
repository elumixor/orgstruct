const map = new Map<string, number>();

export function schedule({ fn, delay = 0.2, id }: { fn: () => void; delay?: number; id: string }) {
    const timeout = map.get(id);
    window.clearTimeout(timeout);
    map.set(id, window.setTimeout(fn, delay * 1000));
}
