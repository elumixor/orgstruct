import { Directive, Input, TemplateRef, ViewContainerRef, inject, type OnInit } from "@angular/core";
import { ContextButtonComponent } from "./context-button.component";
import type { ContextOptions } from "./context-menu-option";
import { ContextMenuComponent } from "./context-menu.component";

@Directive({
    selector: "[appWithContext]",
    standalone: true,
})
export class WithContextDirective implements OnInit {
    @Input({ required: true }) appWithContext!: ContextOptions;

    private readonly viewContainer = inject(ViewContainerRef);
    private readonly template = inject(TemplateRef);

    ngOnInit() {
        const buttonComponent = this.viewContainer.createComponent(ContextButtonComponent);
        buttonComponent.instance.options = this.appWithContext;

        const { style } = buttonComponent.location.nativeElement as HTMLElement;
        style.transform = "translate(-50%, 100%)";
        style.position = "absolute";

        const view = this.viewContainer.createEmbeddedView(this.template);
        const nativeElement = view.rootNodes.first as HTMLElement;

        nativeElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            ContextMenuComponent.show(this.appWithContext, this.viewContainer, e.clientX, e.clientY);
        });
    }
}
