import { Component, EventEmitter, Input, Output, type OnInit, type OnDestroy } from "@angular/core";
import { isBrowser, isMac } from "@utils";

@Component({
    selector: "app-shortcut",
    standalone: true,
    template: ` <div>{{ shortcutDisplay }}</div> `,
    styles: [
        `
            div {
                font-weight: bold;
                letter-spacing: 0.05em;
                color: color-mix(in srgb, var(--fg-color) 80%, white);
            }
        `,
    ],
})
export class ShortcutComponent implements OnInit, OnDestroy {
    @Output() readonly pressed = new EventEmitter<Event>();
    @Input({ required: true }) shortcut!: string;

    shortcutDisplay!: string;
    private isSet = new Map<string, boolean>();
    private readonly isBrowser = isBrowser();

    ngOnInit() {
        let shortcut = this.shortcut.toLowerCase();

        let shortcutDisplay = shortcut.replace("shift", "⇧");
        if (isMac())
            shortcutDisplay = shortcutDisplay
                .replace("meta", "⌘")
                .replace("alt", "⌥")
                .replace("ctrl", "⌃")
                .replace("del", "⌫")
                .replace("esc", "⎋")
                .replace("enter", "⏎");
        this.shortcutDisplay = shortcutDisplay
            .split("+")
            .map((v) => v.capitalize())
            .join("");

        shortcut = shortcut.replace("ctrl", "control");
        for (const key of shortcut.split("+")) this.isSet.set(key, false);

        if (!this.isBrowser) return;

        document.addEventListener("keyup", this.onKeyUp);
        document.addEventListener("keydown", this.onKeyDown);
    }

    ngOnDestroy() {
        if (!this.isBrowser) return;

        document.removeEventListener("keyup", this.onKeyUp);
        document.removeEventListener("keydown", this.onKeyDown);
    }

    private readonly onKeyUp = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        if (this.isSet.has(key)) this.isSet.set(key, false);
        if (key === "meta") for (const key of this.isSet.keys()) this.isSet.set(key, false); // for mac os this is what we have to do
    };

    private readonly onKeyDown = (e: KeyboardEvent) => {
        let key = e.key.toLowerCase();
        if (key === "backspace" || key === "delete") key = "del";
        if (key === "escape") key = "esc";
        if (this.isSet.has(key)) {
            this.isSet.set(key, true);

            if (
                this.isSet
                    .values()
                    .toArray()
                    .every((v) => v)
            ) {
                this.pressed.emit(e);
                e.preventDefault();
                e.stopPropagation();
            }
        }
    };
}
