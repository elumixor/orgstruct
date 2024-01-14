import { Component, Input } from "@angular/core";
import { BlockComponent } from "../block/block.component";

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "[appConnector]",
    standalone: true,
    imports: [],
    templateUrl: "./connector.component.html",
    styleUrl: "./connector.component.scss",
})
export class ConnectorComponent {
    @Input({ required: true }) from!: BlockComponent;
    @Input({ required: true }) to!: BlockComponent;

    get path() {
        const fromElement = this.from.containerRef?.nativeElement;
        const toElement = this.to.containerRef?.nativeElement;

        if (!fromElement || !toElement) return "";

        const fromCenter = {
            x: fromElement.offsetLeft + fromElement.offsetWidth / 2,
            y: fromElement.offsetTop + fromElement.offsetHeight / 2,
        };

        const toCenter = {
            x: toElement.offsetLeft + toElement.offsetWidth / 2,
            y: toElement.offsetTop + toElement.offsetHeight / 2,
        };

        const dx = toCenter.x - fromCenter.x;
        const dy = toCenter.y - fromCenter.y;

        let startX, endX, startY, endY, q1X, q1Y, q2X, q2Y;

        // Horizontal
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                startX = fromElement.offsetLeft + fromElement.offsetWidth;
                endX = toElement.offsetLeft;
                startY = fromCenter.y;
                endY = toCenter.y;
            } else {
                startX = fromElement.offsetLeft;
                endX = toElement.offsetLeft + toElement.offsetWidth;
                startY = fromCenter.y;
                endY = toCenter.y;
            }
            q1X = startX + 0.25 * dx;
            q1Y = startY;
            q2X = endX - 0.25 * dx;
            q2Y = endY;
        } else {
            if (dy > 0) {
                startX = fromCenter.x;
                endX = toCenter.x;
                startY = fromElement.offsetTop + fromElement.offsetHeight;
                endY = toElement.offsetTop;
            } else {
                startX = fromCenter.x;
                endX = toCenter.x;
                startY = fromElement.offsetTop;
                endY = toElement.offsetTop + toElement.offsetHeight;
            }
            q1X = startX;
            q1Y = startY + 0.25 * dy;
            q2X = endX;
            q2Y = endY - 0.25 * dy;
        }

        endX -= startX;
        endY -= startY;
        q1X -= startX;
        q1Y -= startY;
        q2X -= startX;
        q2Y -= startY;

        return `M ${startX} ${startY} c ${q1X} ${q1Y}, ${q2X} ${q2Y}, ${endX} ${endY}`;
    }
}
