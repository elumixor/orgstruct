import { Component, ElementRef, Input, ViewChild } from "@angular/core";

@Component({
    selector: "app-block",
    standalone: true,
    imports: [],
    templateUrl: "./block.component.html",
    styleUrl: "./block.component.scss",
})
export class BlockComponent {
    // @Input() width = "200px";
    // @Input() height = "100px";
    @Input() radius = "10px";
    @Input("x") _x = 0;
    @Input("y") _y = 0;
    @Input() position: "relative" | "absolute" = "absolute";

    @ViewChild("containerRef") containerRef?: ElementRef<HTMLDivElement>;

    get x() {
        return `${this._x}px`;
    }

    get y() {
        return `${this._y}px`;
    }

    // @ViewChild("resizerRef") resizer?: ElementRef<HTMLDivElement>;

    // resizerVisible = true;
    // isDragging = false;

    // private startX = 0;
    // private startY = 0;

    // @HostListener("window:pointerdown", ["$event"])
    // onResizeStart(event: Event) {
    //     const { clientX, clientY, target, button } = event as PointerEvent;
    //     if (button !== 0 || target !== this.resizer?.nativeElement) return;

    //     this.startX = clientX;
    //     this.startY = clientY;
    //     this.isDragging = true;

    //     event.preventDefault();
    //     event.stopPropagation();
    // }

    // @HostListener("window:pointerup", ["$event"])
    // onResizeEnd() {
    //     this.isDragging = false;
    // }

    // @HostListener("window:pointermove", ["$event"])
    // onResize(event: Event) {
    //     if (!this.isDragging) return;

    //     const { clientX, clientY } = event as PointerEvent;

    //     const deltaX = clientX - this.startX;
    //     const deltaY = clientY - this.startY;

    //     this.width = `${parseInt(this.width) + deltaX}px`;
    //     this.height = `${parseInt(this.height) + deltaY}px`;

    //     this.startX = clientX;
    //     this.startY = clientY;
    // }
}
