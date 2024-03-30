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
    type OnChanges,
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
export class DragDirective implements OnInit, OnChanges {
    private static currentDrag?: DragDirective;

    @Output() readonly clicked = new EventEmitter<PointerEvent>();
    @Output() readonly appDrag = new EventEmitter<IDragEvent>();
    @Output() readonly dragStart = new EventEmitter();
    @Output() readonly dragEnd = new EventEmitter();
    @Input() scroll = false;
    @Input() dragEnabled = true;
    @Input({ transform: booleanAttribute }) scrollGlobal?: unknown;
    @Input() propagate = false;

    private x = 0;
    private y = 0;
    private currentX = 0;
    private currentY = 0;
    private moved = false;
    private isDragging = false;

    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly zone = inject(NgZone);
    private readonly platformId = inject(PLATFORM_ID);

    ngOnChanges() {
        this.elementRef.nativeElement.style.cursor = this.dragEnabled ? "grab" : "auto";
    }

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.zone.runOutsideAngular(() => {
            this.elementRef.nativeElement.addEventListener("pointerdown", (e) => {
                if (!this.dragEnabled) return;
                if (e.button !== 0) return;
                this.dragStarted(e.clientX, e.clientY);
            });
            window.addEventListener("pointerup", (e) => {
                if (!this.dragEnabled) return;
                this.dragEnded(e);
            });
            window.addEventListener("pointermove", (e) => {
                if (!this.dragEnabled) return;
                this.dragMove(e.clientX, e.clientY);
            });

            if (!this.scroll) return;

            const target = this.scrollGlobal ? window : this.elementRef.nativeElement;

            target.addEventListener(
                "wheel",
                (e) => {
                    if (!this.dragEnabled) return;
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

        this.currentX = x;
        this.currentY = y;
        this.isDragging = true;

        this.zone.run(() => this.dragStart.emit());
    }

    private dragEnded(e: PointerEvent) {
        if (!this.isDragging) return;

        this.isDragging = false;
        DragDirective.currentDrag = undefined;

        if (this.moved) {
            e.stopPropagation();
            this.zone.run(() => this.dragEnd.emit());
        } else this.zone.run(() => this.clicked.emit(e));

        this.moved = false;
    }

    private dragMove(x: number, y: number) {
        if (!this.isDragging) return;

        this.moved = true;

        const dx = x - this.currentX;
        const dy = y - this.currentY;

        this.currentX = x;
        this.currentY = y;

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
