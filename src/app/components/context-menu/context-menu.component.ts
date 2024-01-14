import { Component, ElementRef, ViewChild, afterNextRender } from "@angular/core";
import { IContextMenuOption } from "./context-menu-option";

@Component({
    selector: "app-context-menu",
    standalone: true,
    imports: [],
    templateUrl: "./context-menu.component.html",
    styleUrl: "./context-menu.component.scss",
})
export class ContextMenuComponent {
    visible = true;
    options: IContextMenuOption[] = [];

    @ViewChild("containerRef") protected readonly containerRef?: ElementRef<HTMLDivElement>;

    constructor() {
        afterNextRender(() => {
            // Register click outside the context menu to close it
            window.addEventListener("pointerdown", (e) => {
                const nativeElement = this.containerRef?.nativeElement;
                if (!nativeElement || !e.composedPath().includes(this.containerRef.nativeElement)) this.visible = false;
            });
        });
    }

    protected _x = 0;
    protected _y = 0;

    get left() {
        return `${this._x}px`;
    }

    get top() {
        return `${this._y}px`;
    }

    show(x: number, y: number, options: IContextMenuOption[]) {
        this.visible = true;
        this._x = x;
        this._y = y;
        this.options = options;
    }

    selectOption(option: IContextMenuOption) {
        option.action();
        this.visible = false;
    }
}
