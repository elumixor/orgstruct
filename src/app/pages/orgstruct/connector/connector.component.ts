import { Component, ContentChildren, QueryList } from "@angular/core";
import { elementFromRef } from "@utils";
import { ConnectableDirective } from "./connectable.directive";

@Component({
    selector: "app-connector",
    standalone: true,
    imports: [],
    templateUrl: "./connector.component.html",
    styleUrl: "./connector.component.scss",
})
export class ConnectorComponent {
    @ContentChildren(ConnectableDirective, { descendants: true })
    readonly connectables?: QueryList<ConnectableDirective>;

    getPath({ element, appConnectable: receive, direction, extension }: ConnectableDirective) {
        const receiverElement = elementFromRef(receive);
        if (!receiverElement) return "";

        return this.getPathAttr(element.nativeElement, receiverElement, {
            direction,
            extension,
        });
    }

    getPathAttr(fromElement: HTMLElement, toElement: HTMLElement, { direction = "horizontal", extension = 1 } = {}) {
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
        if (direction === "horizontal") {
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
            q1X = startX + 0.25 * extension * dx;
            q1Y = startY;
            q2X = endX - 0.25 * extension * dx;
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
            q1Y = startY + 0.25 * extension * dy;
            q2X = endX;
            q2Y = endY - 0.25 * extension * dy;
        }

        endX -= startX;
        endY -= startY;
        q1X -= startX;
        q1Y -= startY;
        q2X -= startX;
        q2Y -= startY;

        if ([startX, startY, endX, endY, q1X, q1Y, q2X, q2Y].some((v) => isNaN(v))) return "";

        return `M ${startX} ${startY} c ${q1X} ${q1Y}, ${q2X} ${q2Y}, ${endX} ${endY}`;
    }
}
