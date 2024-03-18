import { Directive, ElementRef, inject } from "@angular/core";

@Directive({
    selector: "[appContextMenuRoot]",
    standalone: true,
})
export class ContextMenuRootDirective {
    readonly elementRef = inject(ElementRef);
}
