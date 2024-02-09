export const Color = {
    rgb(r: number, g: number, b: number) {
        return `\u001b[38;2;${r};${g};${b}m`;
    },
    hsl(h: number, s: number, l: number) {
        const { r, g, b } = this.hslToRgb(h, s, l);
        return this.rgb(r, g, b);
    },
    hslToRgb(h: number, s: number, l: number) {
        let r;
        let g;
        let b;

        if (s === 0) {
            // If saturation is 0, the color is a shade of gray
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        // Convert the RGB values to the 0-255 range and round them
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        };
    },
    random({ lightness = 0.5, saturation = 0.5 } = {}) {
        const h = Math.random();
        return Color.hsl(h, saturation, lightness);
    },
    uniform(n: number, { lightness = 0.5, saturation = 0.5 } = {}) {
        const offset = Math.random();
        const colors = [];
        for (let i = 0; i < n; i++) {
            const h = (i / n + offset) % 1;
            colors.push(Color.hsl(h, saturation, lightness));
        }
        return colors;
    },

    /* Common colors */

    Reset: "\u001b[0m",
    Black: "\u001b[30m",
    Red: "\u001b[31m",
    Green: "\u001b[32m",
    Yellow: "\u001b[33m",
    Blue: "\u001b[34m",
    Magenta: "\u001b[35m",
    Cyan: "\u001b[36m",
    White: "\u001b[37m",
    Strike: "\u001b[9m",

    /* Light colors */

    LightBlue: "\u001b[94m",
    LightGreen: "\u001b[92m",
    LightCyan: "\u001b[96m",
    LightRed: "\u001b[91m",
    LightMagenta: "\u001b[95m",
    LightYellow: "\u001b[93m",
};

export type RGB = Record<"r" | "g" | "b", number>;

export function colorCode({ r, g, b }: RGB) {
    return `\u001b[38;2;${r};${g};${b}m`;
}

export function colored(text: string, color = Color.random()) {
    return `${color}${text}${Color.Reset}`;
}

export function red(text: string) {
    return colored(text, Color.Red);
}

export function green(text: string) {
    return colored(text, Color.Green);
}

export function yellow(text: string) {
    return colored(text, Color.Yellow);
}

export function blue(text: string) {
    return colored(text, Color.Blue);
}

export function magenta(text: string) {
    return colored(text, Color.Magenta);
}

export function cyan(text: string) {
    return colored(text, Color.Cyan);
}

export function white(text: string) {
    return colored(text, Color.White);
}

export function strike(text: string) {
    return colored(text, Color.Strike);
}
