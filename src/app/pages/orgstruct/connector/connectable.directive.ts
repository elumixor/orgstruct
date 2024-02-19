import { Directive, ElementRef, Input, inject } from "@angular/core";
import type { RefProviderOptional } from "@utils";

@Directive({
    selector: "[appConnectable]",
    standalone: true,
})
export class ConnectableDirective {
    readonly element = inject(ElementRef<HTMLElement>) as ElementRef<HTMLElement>;

    @Input({ required: true }) appConnectable!: RefProviderOptional;
    @Input() direction: "horizontal" | "vertical" = "horizontal";
    @Input() extension = 1;
}
