import { Directive, ElementRef, inject } from "@angular/core";
import { Point, isBrowser } from "@utils";

@Directive({
    selector: "[appConnectable]",
    exportAs: "appConnectable",
    standalone: true,
})
export class ConnectableDirective {
    private readonly element = inject(ElementRef);
    private readonly isBrowser = isBrowser();

    get position() {
        if (!this.isBrowser) return Point();
        const element = this.element.nativeElement as HTMLElement;
        const { x, y, width, height } = element.getBoundingClientRect();
        return Point(x + width / 2, y + height / 2);
    }
}
