import { Directive, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({
    selector: "[appClick]",
    standalone: true,
})
export class ClickDirective {
    @Output() appClick = new EventEmitter<PointerEvent>();

    @HostListener("pointerup", ["$event"])
    onPointerDown(e: PointerEvent) {
        if (e.button !== 0) return;
        this.appClick.emit(e);
    }
}
