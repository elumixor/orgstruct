import { Component, EventEmitter, Input, Output, computed, signal } from "@angular/core";
import { Point } from "@utils";
import type { ConnectionType } from "./connector.service";
import { ContextMenuDirective, ContextOptions } from "@components";

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "[app-line]",
    standalone: true,
    imports: [ContextMenuDirective],
    templateUrl: "./line.component.html",
    styleUrl: "./line.component.scss",
})
export class LineComponent {
    @Input() anchorType?: ConnectionType;
    @Output() readonly removed = new EventEmitter();

    private readonly _from = signal<Point>(Point());
    private readonly _to = signal<Point>(Point());

    @Input({ required: true }) set from(value: Point) {
        this._from.set(value);
    }
    get from() {
        return this._from();
    }
    @Input({ required: true }) set to(value: Point) {
        this._to.set(value);
    }
    get to() {
        return this._to();
    }

    readonly path = computed(() => {
        const startX = this.from.x;
        const startY = this.from.y;
        const endX = this.to.x;
        const endY = this.to.y;

        // If there is no anchor yet, it's a "construction" line, and we just draw a straight line
        if (this.anchorType === undefined) return `M ${startX} ${startY} L ${endX} ${endY}`;

        // Otherwise we need to draw a cubic bezier curve:
        // Calculate the first control point based on the anchor:
        // - if "output", goes to the right
        // - if "event", goes to the bottom
        let q1x, q1y;
        if (this.anchorType === "output") {
            q1x = startX + this.extension;
            q1y = startY;
        } else {
            q1x = startX;
            q1y = startY + this.extension;
        }

        // End is always an input, thus, the extension is always to the left
        const q2x = endX - this.extension;
        const q2y = endY;

        return `M ${startX} ${startY} C ${q1x} ${q1y}, ${q2x} ${q2y}, ${endX} ${endY}`;
    });

    private readonly extension = 50;
    hovered = false;

    readonly contextOptions = new ContextOptions().with("Remove", () => this.removed.emit(), {
        icon: "remove.svg",
        shortcut: "Del",
    });
}
