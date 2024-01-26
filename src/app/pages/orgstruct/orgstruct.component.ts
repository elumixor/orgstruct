import { Component } from "@angular/core";
import { ContextMenuDirective } from "@components";
import { IContextMenuOption } from "@components/context-menu/context-menu-option";
import { NetworkService } from "@services";
import { BlockComponent } from "./block/block.component";
import { ConnectorComponent } from "./connector/connector.component";
import { DivisionsComponent } from "./divisions/divisions.component";

@Component({
    selector: "app-orgstruct",
    standalone: true,
    imports: [BlockComponent, ConnectorComponent, DivisionsComponent, ContextMenuDirective],
    templateUrl: "./orgstruct.component.html",
    styleUrl: "./orgstruct.component.scss",
})
export class OrgstructComponent {
    readonly contextMenuOptions: IContextMenuOption[] = [
        {
            text: "Add division",
            action: () => this.network.create("division"),
        },
    ];

    protected _x = 0;
    protected _y = 0;
    protected scale = 1;
    protected isDown = false;
    protected lastX = 0;
    protected lastY = 0;

    constructor(protected network: NetworkService) {}

    get transform() {
        return `scale(${this.scale})`;
    }

    get x() {
        return `${this._x}px`;
    }

    get y() {
        return `${this._y}px`;
    }

    onWheel(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        const { deltaY } = event as WheelEvent;

        if (deltaY < 0) this.scale *= 1.1;
        else if (deltaY > 0) this.scale /= 1.1;
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
    }
}
