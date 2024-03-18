import { AsyncPipe } from "@angular/common";
import {
    ChangeDetectorRef,
    Component,
    QueryList,
    ViewChildren,
    computed,
    inject,
    type AfterViewInit,
    type OnDestroy,
    HostListener,
} from "@angular/core";
import {
    ButtonComponent,
    ContextMenuComponent,
    ContextMenuDirective,
    ContextOptions,
    DragDirective,
    ZoomDirective,
    type IDragEvent,
    type IZoomEvent,
} from "@components";
import { ProcessesService } from "@services";
import { locallyStored, randomString, routeParam, signalArray } from "@utils";
import { AreaComponent } from "./area/area.component";
import type { IArea, IBlock, IConnector } from "./block";
import { BlockComponent } from "./block/block.component";
import { ConnectableDirective } from "./connector/connectable.directive";
import { ConnectorService, type ConstructionConnectionType } from "./connector/connector.service";
import { LineManagerComponent } from "./connector/line-manager.component";

@Component({
    selector: "app-process-detail",
    standalone: true,
    imports: [
        AsyncPipe,
        DragDirective,
        ZoomDirective,
        BlockComponent,
        AreaComponent,
        ButtonComponent,
        ContextMenuDirective,
        ContextMenuComponent,
        LineManagerComponent,
        ConnectableDirective,
    ],
    templateUrl: "./process-detail.component.html",
    styleUrl: "./process-detail.component.scss",
})
export class ProcessDetailComponent implements AfterViewInit, OnDestroy {
    private readonly connectorService = inject(ConnectorService);
    private readonly processesService = inject(ProcessesService);
    private readonly changeDetector = inject(ChangeDetectorRef);

    readonly y = locallyStored("canvas.x", 0);
    readonly x = locallyStored("canvas.y", 0);
    readonly contextOptions = new ContextOptions()
        .with("Add block", () => this.addBlock(), { icon: "add.svg", shortcut: "b" })
        .with("Add area (horizontal)", () => this.addArea(false), { icon: "add.svg", shortcut: "h" })
        .with("Add area (vertical)", () => this.addArea(true), { icon: "add.svg", shortcut: "v" });
    private readonly processId = routeParam("id", 0, Number);
    readonly process = computed(() => this.processesService.processes()[this.processId()]);
    readonly blocks = locallyStored("blocks", signalArray<IBlock>());
    readonly areas = locallyStored("areas", signalArray<IArea>());
    readonly connectors = locallyStored("connectors", signalArray<IConnector>());
    readonly areasVertical = computed(() => this.areas().filter((a) => a.isVertical));
    readonly areasHorizontal = computed(() => this.areas().filter((a) => !a.isVertical));
    z = 1;
    gridSize = 10;
    createCMVisible = false;
    @ViewChildren(BlockComponent) private readonly blockComponents!: QueryList<BlockComponent>;

    ngAfterViewInit() {
        const map = new Map<string, BlockComponent>(this.blockComponents.map((b) => [b.id, b]));
        for (const { fromBlockId, toBlockId, anchorType, id } of this.connectorService.savedLines()) {
            const from = map.get(fromBlockId);
            if (!from) throw new Error(`Block with id ${fromBlockId} not found`);

            const to = map.get(toBlockId);
            if (!to) throw new Error(`Block with id ${toBlockId} not found`);

            from.connectTo(anchorType, to, id, false);
        }

        this.changeDetector.detectChanges();
    }

    ngOnDestroy() {
        this.connectorService.clearLines();
    }

    onDrag({ dx, dy }: IDragEvent) {
        this.x.update((x) => x + dx);
        this.y.update((y) => y + dy);
    }
    onZoom({ z }: IZoomEvent) {
        this.z = z;
    }
    addBlock() {
        this.blocks.push({ x: 0, y: 0, title: "New block", id: randomString(10) });
    }
    addArea(isVertical: boolean) {
        this.areas.push({ x: 0, y: 0, width: 100, height: 100, title: "New area", isVertical });
    }
    removeBlock(block: IBlock) {
        this.blocks.remove(block);
        this.connectorService.removeBlock(block.id);
    }
    saveState() {
        this.blocks.save();
        this.areas.save();
    }

    @HostListener("pointerup", ["$event"])
    onPointerUp(event: PointerEvent) {
        const currentLine = this.connectorService.currentLine;
        if (!currentLine) return;

        event.stopPropagation();
        this.connectorService.onLineEnded();

        const targetPoint = currentLine.to();

        const newBlock = { x: targetPoint.x, y: targetPoint.y, title: "New block", id: randomString(10) };
        this.blocks.push(newBlock);

        this.newConnection = {
            ...currentLine,
            targetBlockId: newBlock.id,
        };
        // this.connectorService.addLine({

        // });
        // const newBlock = this.blocks().last;
    }

    private newConnection?: {
        id: string;
        sourceBlock: BlockComponent;
        lineType: ConstructionConnectionType;
        targetBlockId: string;
    };

    ngAfterViewChecked() {
        if (!this.newConnection) return;

        const { sourceBlock, lineType, id, targetBlockId } = this.newConnection;
        const targetBlock = this.blockComponents.find((b) => b.id === targetBlockId);
        if (!targetBlock) throw new Error(`Block with id ${targetBlockId} not found`);

        if (lineType === "input") targetBlock.connectTo("output", sourceBlock, id, true);
        else sourceBlock.connectTo(lineType, targetBlock, id, true);

        this.newConnection = undefined;

        this.changeDetector.detectChanges();
    }
}
