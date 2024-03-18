import { isPlatformBrowser } from "@angular/common";
import {
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    Output,
    PLATFORM_ID,
    inject,
    type OnInit,
    booleanAttribute,
} from "@angular/core";

export interface IDragEvent {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

@Directive({
    selector: "[appDrag]",
    standalone: true,
})
export class DragDirective implements OnInit {
    private static currentDrag?: DragDirective;

    @Output() appDrag = new EventEmitter<IDragEvent>();
    @Output() dragStart = new EventEmitter();
    @Output() dragEnd = new EventEmitter();
    @Input() scroll = false;
    @Input({ transform: booleanAttribute }) scrollGlobal?: unknown;
    @Input() propagate = false;

    private x = 0;
    private y = 0;
    private startX = 0;
    private startY = 0;
    private isDragging = false;

    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly zone = inject(NgZone);
    private readonly platformId = inject(PLATFORM_ID);

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.zone.runOutsideAngular(() => {
            this.elementRef.nativeElement.addEventListener("pointerdown", (e) => {
                if (e.button !== 0) return;
                this.dragStarted(e.clientX, e.clientY);
            });
            window.addEventListener("pointerup", () => this.dragEnded());
            window.addEventListener("pointermove", (e) => this.dragMove(e.clientX, e.clientY));

            if (!this.scroll) return;

            const target = this.scrollGlobal ? window : this.elementRef.nativeElement;

            target.addEventListener(
                "wheel",
                (e) => {
                    const { ctrlKey, deltaX, deltaY } = e as WheelEvent;
                    if (ctrlKey) return; // zoom event
                    this.change(-deltaX, -deltaY);
                    e.preventDefault();
                },
                { passive: false },
            );
        });
    }

    private dragStarted(x: number, y: number) {
        if (DragDirective.currentDrag) return;
        DragDirective.currentDrag = this;

        this.startX = x;
        this.startY = y;
        this.isDragging = true;

        this.zone.run(() => this.dragStart.emit());
    }

    private dragEnded() {
        this.isDragging = false;
        DragDirective.currentDrag = undefined;

        this.zone.run(() => this.dragEnd.emit());
    }

    private dragMove(x: number, y: number) {
        if (!this.isDragging) return;

        const dx = x - this.startX;
        const dy = y - this.startY;

        this.startX = x;
        this.startY = y;

        this.change(dx, dy);
    }

    private change(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;

        this.zone.run(() => {
            this.appDrag.emit({ x: this.x, y: this.y, dx, dy });
        });
    }
}
