import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output,
    ViewChild,
    effect,
    inject,
    signal,
    type OnInit,
    type WritableSignal,
} from "@angular/core";
import { appear } from "@animations";
import {
    ClickOutsideDirective,
    ContextMenuDirective,
    ContextOptions,
    DragDirective,
    EditableComponent,
    IconComponent,
    type IDragEvent,
} from "@components";
import { Point, snappedVal } from "@utils";
import type { IBlock } from "../block";
import { ConnectorService, type ConnectionType, type ConstructionConnectionType } from "../connector/connector.service";
import { ProcessDetailComponent } from "../process-detail.component";

@Component({
    selector: "app-block",
    standalone: true,
    imports: [DragDirective, ContextMenuDirective, IconComponent, EditableComponent, ClickOutsideDirective],
    templateUrl: "./block.component.html",
    styleUrl: "./block.component.scss",
    animations: [
        appear("appear-left", { translateY: "0px", translateX: "-10px" }),
        appear("appear-right", { translateY: "0px", translateX: "10px" }),
        appear("appear-down", { translateY: "-10px", translateX: "0px" }),
    ],
})
export class BlockComponent implements OnInit {
    @Input({ required: true }) block!: IBlock;

    @Output() readonly removed = new EventEmitter();
    @Output() readonly changed = new EventEmitter();
    @Output() readonly selected = new EventEmitter<boolean>();

    isEditing = false;
    hovered = false;

    @ViewChild("inputAnchor") private readonly inputAnchor!: ElementRef<HTMLElement>;
    @ViewChild("outputAnchor") private readonly outputAnchor!: ElementRef<HTMLElement>;
    @ViewChild("eventAnchor") private readonly eventAnchor!: ElementRef<HTMLElement>;
    private readonly element = inject(ElementRef);

    private readonly connectorService = inject(ConnectorService);
    private readonly gridSize = inject(ProcessDetailComponent).gridSize;
    private anchors = [] as { lineId: string; ref: ElementRef<HTMLElement>; point: WritableSignal<Point> }[];
    readonly x = snappedVal(0, this.gridSize);
    readonly y = snappedVal(0, this.gridSize);

    @HostBinding("style.left.px")
    get xValue() {
        return this.x.value;
    }

    @HostBinding("style.top.px")
    get yValue() {
        return this.y.value;
    }

    get hasInputs() {
        return this.anchors.some((a) => a.ref === this.inputAnchor);
    }
    get hasOutputs() {
        return this.anchors.some((a) => a.ref === this.outputAnchor);
    }
    get hasEvents() {
        return this.anchors.some((a) => a.ref === this.eventAnchor);
    }

    constructor() {
        effect(() => {
            const lines = this.connectorService.lines();
            this.anchors = this.anchors.filter((a) => lines.some((line) => line.id === a.lineId));
        });

        this.selected.subscribe((isEditing) => {
            this.isEditing = isEditing;
        });
    }

    ngOnInit() {
        this.x.value = this.block.x;
        this.y.value = this.block.y;
    }

    onDrag({ dx, dy }: IDragEvent) {
        const snappedX = this.x.value;
        const snappedY = this.y.value;

        this.x.unsnapped += dx;
        this.y.unsnapped += dy;
        this.block.x = this.x.value;
        this.block.y = this.y.value;
        this.updateAnchors(this.x.value - snappedX, this.y.value - snappedY);
        this.changed.emit();
    }

    get contextOptions() {
        return new ContextOptions().withDanger("Remove", () => this.removed.emit(), {
            icon: "remove.svg",
            shortcut: "Del",
        });
    }

    get id() {
        return this.block.id;
    }

    startLine(e: PointerEvent, anchorType: ConstructionConnectionType) {
        this.hovered = false;
        e.stopPropagation();

        const anchorElement = this[`${anchorType}Anchor`];
        const startPoint = this.getAnchoredPoint(anchorElement.nativeElement);

        const element = this.element.nativeElement as HTMLElement;
        const rect = element.getBoundingClientRect();
        const endX = e.clientX - rect.x + this.x.value;
        const endY = e.clientY - rect.y + this.y.value;
        const endPoint = Point(endX, endY);

        this.connectorService.onLineStarted(this, anchorType, startPoint, endPoint);
    }

    select() {
        this.selected.emit(true);
    }

    deselect() {
        this.selected.emit(false);
    }

    @HostListener("pointerup", ["$event"])
    onPointerUp(event: PointerEvent) {
        const currentLine = this.connectorService.currentLine;
        if (!currentLine) return;

        event.stopPropagation();
        this.connectorService.onLineEnded();

        const sourceBlock = currentLine.sourceBlock;
        let anchorType = currentLine.lineType;

        let [fromBlock, toBlock] = [sourceBlock, this as BlockComponent];
        if (fromBlock === toBlock) {
            // eslint-disable-next-line no-console
            console.warn("Block cannot connect to itself. Maybe show a message later.");
            return;
        }

        if (anchorType === "input") {
            [fromBlock, toBlock] = [toBlock, fromBlock];
            anchorType = "output";
        }

        fromBlock.connectTo(anchorType, toBlock, currentLine.id, true);
    }

    connectTo(anchorType: Exclude<ConnectionType, "input">, toBlock: BlockComponent, id: string, save: boolean) {
        const fromBlock = this as BlockComponent;
        const anchorFrom = fromBlock.addAnchor(id, anchorType);
        const anchorTo = toBlock.addAnchor(id, "input");
        this.connectorService.addLine({
            from: anchorFrom.point,
            to: anchorTo.point,
            anchorType,
            fromBlockId: fromBlock.id,
            toBlockId: toBlock.id,
            id,
            save,
        });
    }

    private addAnchor(lineId: string, anchorType: ConstructionConnectionType) {
        const elementRef =
            anchorType === "input" ? this.inputAnchor : anchorType === "output" ? this.outputAnchor : this.eventAnchor;
        const point = this.getAnchoredPoint(elementRef.nativeElement);
        const anchor = { lineId, ref: elementRef, point: signal(point) };
        this.anchors.push(anchor);
        return anchor;
    }

    private getAnchoredPoint(anchor: HTMLElement) {
        const x = anchor.offsetLeft + this.x.value;
        const y = anchor.offsetTop + this.y.value;
        return Point(x, y);
    }

    private updateAnchors(dx: number, dy: number) {
        for (const anchor of this.anchors) anchor.point.update(({ x, y }) => Point(x + dx, y + dy));
    }
}
