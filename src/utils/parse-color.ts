const colors = {
    danger: "rgba(196, 0, 0, 0.452)",
    primary: "rgba(33, 112, 148, 0.2)",
    warning: "rgba(148, 148, 33, 0.2)",
} as Record<string, string | undefined>;

export function parseColor(color: string) {
    return colors[color] ?? color;
}
