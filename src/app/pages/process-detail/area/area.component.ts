import { Component, EventEmitter, HostBinding, Input, Output, inject, type OnInit, Type } from "@angular/core";
import { ContextMenuDirective, ContextOptions, DialogComponent, DragDirective, type IDragEvent } from "@components";
import { snappedVal } from "@utils";
import type { IArea } from "../block";
import { ProcessDetailComponent } from "../process-detail.component";

const ColorComponent: Type<unknown> = undefined as unknown as Type<unknown>;

@Component({
    selector: "app-area",
    standalone: true,
    imports: [DragDirective, ContextMenuDirective],
    templateUrl: "./area.component.html",
    styleUrl: "./area.component.scss",
})
export class AreaComponent implements OnInit {
    @Input({ required: true }) area!: IArea;
    @Output() readonly changed = new EventEmitter();
    @Output() readonly removed = new EventEmitter();

    private readonly gridSize = inject(ProcessDetailComponent).gridSize;
    private readonly dialog = inject(DialogComponent);

    private _width = snappedVal(200, this.gridSize);
    private _height = snappedVal(200, this.gridSize);
    readonly x = snappedVal(0, this.gridSize);
    readonly y = snappedVal(0, this.gridSize);

    readonly contextOptions = new ContextOptions()
        .with("Remove", () => this.removed.emit(), {
            icon: "remove.svg",
            shortcut: "Del",
        })
        .with("Rename", () => this.rename(), { icon: "edit.svg", shortcut: "r" })
        .withNested("Color", new ContextOptions().withComponent("Color", ColorComponent), { shortcut: "c" });

    @HostBinding("class.horizontal") get isHorizontal() {
        return !this.area.isVertical;
    }

    @HostBinding("style.width") get width() {
        if (!this.area.isVertical) return "100vw";
        return `${this._width.value}px`;
    }

    @HostBinding("style.height") get height() {
        if (this.area.isVertical) return "100vh";
        return `${this._height.value}px`;
    }

    @HostBinding("style.left.px") get left() {
        return this.x.value;
    }

    @HostBinding("style.top.px") get top() {
        return this.y.value;
    }

    ngOnInit() {
        if (this.area.isVertical) {
            this.x.value = this.area.x;
            this._width.unsnapped = this.area.width;
        } else {
            this.y.value = this.area.y;
            this._height.unsnapped = this.area.height;
        }
    }

    drag({ dy, dx }: IDragEvent, ending = false) {
        const value = !this.area.isVertical ? dy : dx;

        if (ending) {
            if (this.area.isVertical) this._width.unsnapped += value;
            else this._height.unsnapped += value;
            this.update();
            return;
        }

        if (this.area.isVertical) {
            this.x.unsnapped += value;
            this._width.unsnapped -= value;
        } else {
            this.y.unsnapped += value;
            this._height.unsnapped -= value;
        }

        this.update();
    }

    dragPosition({ dx, dy }: IDragEvent) {
        if (this.area.isVertical) this.x.unsnapped += dx;
        else this.y.unsnapped += dy;
        this.update();
    }

    async rename() {
        const result = await this.dialog.prompt("Rename area", this.area.title, { icon: "edit.svg" });
        if (result.success) {
            this.area.title = result.value;
            this.changed.emit();
        }
    }

    private update() {
        if (this.area.isVertical) {
            this.area.x = this.x.value;
            this.area.width = this._width.value;
        } else {
            this.area.y = this.y.value;
            this.area.height = this._height.value;
        }

        this.changed.emit();
    }
}
