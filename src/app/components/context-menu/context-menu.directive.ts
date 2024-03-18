import { isPlatformBrowser } from "@angular/common";
import { Directive, ElementRef, Input, PLATFORM_ID, ViewContainerRef, inject } from "@angular/core";
import type { ContextOptions } from "./context-menu-option";
import { ContextMenuComponent } from "./context-menu.component";

@Directive({
    selector: "[appContextMenu]",
    standalone: true,
    exportAs: "appContextMenu",
})
export class ContextMenuDirective {
    @Input({ required: true }) appContextMenu!: ContextOptions;

    private readonly platformId = inject(PLATFORM_ID);
    private readonly viewContainer = inject(ViewContainerRef);

    constructor(elementRef: ElementRef<HTMLElement>) {
        if (!isPlatformBrowser(this.platformId)) return;

        elementRef.nativeElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.show(e.clientX, e.clientY);
        });
    }

    show(x: number, y: number) {
        ContextMenuComponent.show(this.appContextMenu, this.viewContainer, x, y);
    }
}
