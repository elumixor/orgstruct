import { Directive, ElementRef, Input } from "@angular/core";
import type { IContextMenuOption } from "./context-menu-option";
import { ContextMenuComponent } from "./context-menu.component";

@Directive({
    selector: "[appContextMenu]",
    standalone: true,
})
export class ContextMenuDirective {
    @Input({ required: true }) appContextMenu: IContextMenuOption[] = [];

    constructor(contextMenu: ContextMenuComponent, hostElement: ElementRef<HTMLElement>) {
        hostElement.nativeElement.addEventListener("contextmenu", (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            contextMenu.show(event.clientX, event.clientY, this.appContextMenu);
        });
    }
}
