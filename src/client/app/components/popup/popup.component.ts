import { NgTemplateOutlet } from "@angular/common";
import { Component, ElementRef, NgZone, TemplateRef, computed, contentChild, inject, viewChild } from "@angular/core";
import { PopupContentDirective } from "./popup-content.directive";
import { appear } from "@animations";

@Component({
    selector: "app-popup",
    standalone: true,
    imports: [NgTemplateOutlet, PopupContentDirective],
    templateUrl: "./popup.component.html",
    styleUrl: "./popup.component.scss",
    animations: [appear("appear", { duration: "0.1s", scale: 0.9 })],
})
export class PopupComponent {
    visible = false;
    x = 0;
    y = 0;
    context?: unknown;
    private readonly content = contentChild(PopupContentDirective, { read: TemplateRef<HTMLElement> });
    private readonly container = viewChild<ElementRef<HTMLElement>>("container");
    private readonly zone = inject(NgZone);

    readonly element = computed(() => this.container()?.nativeElement);
    readonly templateOutlet = computed(() => this.content() ?? null);

    show(event: Event, context?: unknown) {
        if (this.onTarget(event) && this.visible) return;

        this.context = context;
        this.visible = true;

        const { x, bottom } = (event.currentTarget as HTMLElement).getBoundingClientRect();

        this.x = x;
        this.y = bottom;

        // Should be done in the next tick, otherwise the click event will be triggered immediately and the popup will be hidden
        this.zone.runOutsideAngular(() => setTimeout(() => document.addEventListener("click", this.onClick)));
    }
    hide() {
        this.visible = false;
        document.removeEventListener("click", this.onClick);
    }

    toggle(event: Event, context?: unknown) {
        if (!this.visible) this.show(event, context);
        else this.hide();
    }

    private readonly onClick = (event: Event) => {
        if (this.onTarget(event)) return;
        this.zone.run(() => this.hide());
    };

    private onTarget(event: Event) {
        const element = this.element();
        return !!element && event.composedPath().includes(element);
    }
}
