import {
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    Output,
    booleanAttribute,
    inject,
    type OnInit,
} from "@angular/core";
import { isBrowser } from "@utils";

export interface IZoomEvent {
    z: number;
    dz: number;
}

@Directive({
    selector: "[appZoom]",
    standalone: true,
})
export class ZoomDirective implements OnInit {
    @Output() appZoom = new EventEmitter<IZoomEvent>();
    @Input({ transform: booleanAttribute }) zoomGlobal?: unknown;
    private z = 1;

    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly isBrowser = isBrowser();
    private readonly zone = inject(NgZone);

    ngOnInit() {
        if (!this.isBrowser) return;

        const target = this.zoomGlobal ? window : this.elementRef.nativeElement;

        this.zone.runOutsideAngular(() => {
            target.addEventListener(
                "wheel",
                (e) => {
                    const { ctrlKey, deltaY } = e as WheelEvent;
                    if (!ctrlKey) return; // scroll event

                    e.preventDefault();

                    const dz = deltaY * 0.01;
                    this.z -= dz;

                    this.zone.run(() => this.appZoom.emit({ z: this.z, dz }));
                },
                { passive: false },
            );
        });
    }
}
