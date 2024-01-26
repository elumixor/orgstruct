import { Directive, ElementRef, Input } from "@angular/core";
import { ContextMenuComponent } from "./context-menu.component";
import { IContextMenuOption } from "./context-menu-option";

@Directive({
    selector: "[appContextMenu]",
    standalone: true,
})
export class ContextMenuDirective {
    @Input({ required: true }) appContextMenu: IContextMenuOption[] = [];
    // @Input() parentContextItems: "inherit" | "ignore" = "inherit";

    constructor(
        protected readonly contextMenu: ContextMenuComponent,
        protected readonly hostElement: ElementRef<HTMLElement>,
    ) {
        hostElement.nativeElement.addEventListener("contextmenu", (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            contextMenu.show(event.clientX, event.clientY, this.appContextMenu);
        });
    }
}
