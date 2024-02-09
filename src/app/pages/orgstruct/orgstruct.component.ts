import { AfterViewInit, Component, ElementRef, NgZone, PLATFORM_ID, ViewChild, inject } from "@angular/core";
import { ContextMenuDirective, IContextMenuOption, LazyComponent, LazyTargetDirective } from "@components";
import { isPlatformBrowser } from "@angular/common";
import { BlockComponent } from "./block/block.component";
import { ConnectorComponent } from "./connector/connector.component";
import { DivisionsComponent } from "./divisions/divisions.component";

@Component({
    selector: "app-orgstruct",
    standalone: true,
    imports: [
        BlockComponent,
        ConnectorComponent,
        DivisionsComponent,
        ContextMenuDirective,
        LazyComponent,
        LazyTargetDirective,
    ],
    templateUrl: "./orgstruct.component.html",
    styleUrl: "./orgstruct.component.scss",
})
export class OrgstructComponent implements AfterViewInit {
    readonly contextMenuOptions: IContextMenuOption[] = [
        {
            text: "Add division",
            action: () => this.divisions?.divisions.add(),
        },
    ];

    @ViewChild("gridRef") gridRef?: ElementRef<HTMLDivElement>;
    @ViewChild("contentRef") contentRef?: ElementRef<HTMLDivElement>;

    @ViewChild(DivisionsComponent) divisions?: DivisionsComponent;

    private readonly zone = inject(NgZone);

    private _x = 0;
    private _y = 0;
    private scale = 1;
    private isDown = false;
    private lastX = 0;
    private lastY = 0;
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            this.gridRef?.nativeElement.addEventListener("wheel", this.onWheel.bind(this));
            this.gridRef?.nativeElement.addEventListener("pointerdown", this.onPointerDown.bind(this));
            this.gridRef?.nativeElement.addEventListener("pointerup", this.onPointerUp.bind(this));
            this.gridRef?.nativeElement.addEventListener("pointermove", this.onPointerMove.bind(this));
        });
    }

    onWheel(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        const { deltaY } = event as WheelEvent;

        if (deltaY < 0) this.scale *= 1.1;
        else if (deltaY > 0) this.scale /= 1.1;

        this.contentRef!.nativeElement.style.transform = `scale(${this.scale})`;
    }

    onPointerDown(event: Event) {
        const { clientX, clientY, button } = event as PointerEvent;

        // Check if the middle mouse button is pressed
        if (button === 1) this.isDown = true;

        this.lastX = clientX;
        this.lastY = clientY;
    }

    onPointerUp(event: Event) {
        const { button } = event as PointerEvent;
        if (button === 1) this.isDown = false;
    }

    onPointerMove(event: Event) {
        if (!this.isDown) return;

        const { clientX, clientY } = event as PointerEvent;

        this._x += clientX - this.lastX;
        this._y += clientY - this.lastY;

        this.lastX = clientX;
        this.lastY = clientY;

        this.contentRef!.nativeElement.style.left = `${this._x}px`;
        this.contentRef!.nativeElement.style.top = `${this._y}px`;
    }
}
