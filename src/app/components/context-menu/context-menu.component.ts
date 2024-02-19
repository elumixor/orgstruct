import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";
import { ClickDirective } from "../click.directive";
import type { IContextMenuOption } from "./context-menu-option";

@Component({
    selector: "app-context-menu",
    standalone: true,
    imports: [ClickDirective],
    templateUrl: "./context-menu.component.html",
    styleUrl: "./context-menu.component.scss",
    animations: [
        trigger("appear", [
            transition("* => *", [
                // each time the binding value changes
                query(
                    ":leave",
                    [
                        stagger("0.1s", [
                            animate(
                                "0.2s",
                                style({ opacity: 0, transform: "translateX(30px) translateY(-10px) rotateY(-10deg)" }),
                            ),
                        ]),
                    ],
                    { optional: true },
                ),
                query(
                    ":enter",
                    [
                        style({
                            opacity: 0,
                            transform: "translateX(-30px) translateY(-10px) rotateY(0deg)",
                        }),
                        stagger("0.05s", [
                            animate(
                                "0.2s ease-in-out",
                                style({
                                    opacity: 1,
                                    transform: "translateX(-10px) translateY(-10px) rotateY(-5deg)",
                                }),
                            ),
                        ]),
                    ],
                    {
                        optional: true,
                    },
                ),
            ]),
        ]),
    ],
})
export class ContextMenuComponent {
    visible = true;
    options: IContextMenuOption[] = [];

    @ViewChild("containerRef") private readonly containerRef?: ElementRef<HTMLDivElement>;

    private _x = 0;
    private _y = 0;

    get left() {
        return `${this._x}px`;
    }

    get top() {
        return `${this._y}px`;
    }

    show(x: number, y: number, options: IContextMenuOption[]) {
        this._x = x;
        this._y = y;
        this.options = options;
        this.visible = true;
    }

    selectOption(option: IContextMenuOption) {
        option.action();
        this.visible = false;
    }

    @HostListener("window:pointerdown", ["$event"])
    closeContextMenu(e: PointerEvent) {
        const nativeElement = this.containerRef?.nativeElement;
        if (!nativeElement || !e.composedPath().includes(this.containerRef.nativeElement) || e.button !== 2) {
            this.visible = false;
        }
    }
}
