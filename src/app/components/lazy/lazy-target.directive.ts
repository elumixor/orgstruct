import { Directive } from "@angular/core";

@Directive({
    selector: "[appLazyTarget]",
    standalone: true,
})
export class LazyTargetDirective {}
