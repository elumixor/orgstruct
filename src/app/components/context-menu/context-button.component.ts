import { Component, ElementRef, Input, ViewChild, ViewContainerRef, inject } from "@angular/core";
import { ClickDirective } from "@components/click.directive";
import { IconComponent } from "@components/icon.component";
import type { ContextOptions } from "./context-menu-option";
import { ContextMenuComponent } from "./context-menu.component";

@Component({
    selector: "app-context-button",
    standalone: true,
    imports: [IconComponent, ClickDirective],
    template: `<app-icon class="icon" src="dots.svg" (appClick)="showContextMenu()" #iconRef />`,
    styles: [
        `
            .icon {
                transform: translate(-50%, -50%);
                cursor: pointer;
                display: flex;

                &:hover {
                    --fg-color: var(--secondary);
                    transform: translate(-50%, -50%) scale(1.2);
                }
                transition: all 0.1s ease-in-out;
            }
        `,
    ],
})
export class ContextButtonComponent {
    @Input({ required: true }) options!: ContextOptions;

    @ViewChild("iconRef", { read: ElementRef }) private readonly iconRef!: ElementRef<HTMLElement>;
    private readonly viewContainer = inject(ViewContainerRef);

    showContextMenu() {
        const element = this.iconRef.nativeElement;
        const { x, y, width, height } = element.getBoundingClientRect();
        ContextMenuComponent.show(this.options, this.viewContainer, x + width / 2, y + height / 2);
    }
}
