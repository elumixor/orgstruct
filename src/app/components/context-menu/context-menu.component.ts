import { ChangeDetectorRef, Component, ElementRef, ViewChild, afterNextRender } from "@angular/core";
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

    @ViewChild("containerRef") private readonly containerRef?: ElementRef<HTMLDivElement>;

    private _x = 0;
    private _y = 0;

    constructor(changeDetectorRef: ChangeDetectorRef) {
        afterNextRender(() => {
            // Register click outside the context menu to close it
            window.addEventListener("pointerdown", (e) => {
                const nativeElement = this.containerRef?.nativeElement;
                if (!nativeElement || !e.composedPath().includes(this.containerRef.nativeElement) || e.button !== 2) {
                    this.visible = false;
                    changeDetectorRef.detectChanges();
                }
            });
        });
    }

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
