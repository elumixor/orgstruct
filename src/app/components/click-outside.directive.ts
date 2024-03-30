import { Directive, ElementRef, EventEmitter, HostListener, Output, inject } from "@angular/core";

@Directive({
    selector: "[appClickOutside]",
    standalone: true,
})
export class ClickOutsideDirective {
    @Output() readonly appClickOutside = new EventEmitter<PointerEvent>();
    private readonly element = inject(ElementRef);

    @HostListener("document:pointerup", ["$event"])
    onPointerDown(e: PointerEvent) {
        if (e.composedPath().includes(this.element.nativeElement as HTMLElement)) return;
        this.appClickOutside.emit(e);
    }
}
