import { Injectable, signal, type WritableSignal } from "@angular/core";
import { isBrowser, locallyStored, Point, randomString, signalArray } from "@utils";
import type { BlockComponent } from "../block/block.component";

// function arraySubject<T>(initial: T[]) {
//     const subject = new BehaviorSubject<T[]>(initial);

//     const update = () => {
//         subject.next([...subject.value]);
//     };

//     const push = (value: T) => {
//         subject.value.push(value);
//         update();
//     };

//     const remove = (value: T) => {
//         subject.value.remove(value);
//         update();
//     };

//     Reflect.defineProperty(subject, "update", { value: update });
//     Reflect.defineProperty(subject, "push", { value: push });
//     Reflect.defineProperty(subject, "remove", { value: remove });

//     return subject as typeof subject & {
//         update: typeof update;
//         push: typeof push;
//         remove: typeof remove;
//     };
// }
export type ConnectionType = "output" | "event";
export type ConstructionConnectionType = "input" | ConnectionType;

export interface LineData {
    id: string;
    sourceBlock: BlockComponent;
    lineType: ConstructionConnectionType;
    from: WritableSignal<Point>;
    to: WritableSignal<Point>;
}

@Injectable({
    providedIn: "root",
})
export class ConnectorService {
    readonly lines = signalArray<{
        id: string;
        from: WritableSignal<Point>;
        to: WritableSignal<Point>;
        anchorType?: ConnectionType;
        lineType?: ConstructionConnectionType;
    }>();

    readonly savedLines = locallyStored(
        "lines",
        signalArray<{
            id: string;
            anchorType: ConnectionType;
            fromBlockId: string;
            toBlockId: string;
        }>(),
    );

    currentLine?: LineData;

    constructor() {
        if (isBrowser()) {
            window.addEventListener("pointerup", this.onLineEnded.bind(this));
            window.addEventListener("pointermove", this.onLineMoved.bind(this));
        }
    }

    onLineStarted(sourceBlock: BlockComponent, lineType: ConstructionConnectionType, start: Point, end: Point) {
        const currentLineStart = signal(start);
        const currentLineEnd = signal(end);

        this.currentLine = { sourceBlock, lineType, from: currentLineStart, to: currentLineEnd, id: randomString(10) };
        this.lines.push(this.currentLine);
    }

    onLineMoved({ movementX: dx, movementY: dy }: PointerEvent) {
        if (!this.currentLine) return;
        this.currentLine.to.update(({ x, y }) => Point(x + dx, y + dy));
    }

    onLineEnded() {
        if (!this.currentLine) return;
        this.lines.remove(this.currentLine);
        this.currentLine = undefined;
    }

    addLine({
        from,
        to,
        anchorType,
        fromBlockId,
        toBlockId,
        id,
        save,
    }: {
        from: WritableSignal<Point>;
        to: WritableSignal<Point>;
        anchorType: ConnectionType;
        fromBlockId: string;
        toBlockId: string;
        id: string;
        save: boolean;
    }) {
        this.lines.push({ from, to, anchorType, id });
        if (save) this.savedLines.push({ anchorType, fromBlockId, toBlockId, id });
    }

    removeLine(lineId: string) {
        const current = this.lines().find((l) => l.id === lineId);
        if (!current) throw new Error(`Line with id ${lineId} not found`);
        this.lines.remove(current);

        const saved = this.savedLines().find((l) => l.id === lineId);
        if (!saved) throw new Error(`Line with id ${lineId} not found`);
        this.savedLines.remove(saved);
    }

    removeBlock(blockId: string) {
        this.savedLines.update((lines) => lines.filter((l) => l.fromBlockId !== blockId && l.toBlockId !== blockId));
        this.lines.update((lines) => {
            const currentIds = new Set(this.savedLines().map((l) => l.id));
            return lines.filter((l) => currentIds.has(l.id));
        });
    }

    clearLines() {
        this.lines.set([]);
    }
}
