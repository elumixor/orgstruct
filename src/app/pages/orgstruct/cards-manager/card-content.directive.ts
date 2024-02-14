import { Directive, Input, TemplateRef, inject } from "@angular/core";

@Directive({
    selector: "[appCardContent]",
    standalone: true,
    exportAs: "appCardContent",
})
export class CardContentDirective {
    readonly templateRef = inject(TemplateRef);

    @Input() closeable = false;
}
