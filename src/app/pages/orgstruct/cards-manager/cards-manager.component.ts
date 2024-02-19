import { Component, HostListener, Input } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Point, type PointArgs, type RefProviderOptional, elementFromRef } from "@utils";
import { CardContentDirective } from "./card-content.directive";
import { animations } from "./animations";
import { ClickDirective } from "@components";

@Component({
    selector: "app-cards-manager",
    standalone: true,
    imports: [CardContentDirective, NgTemplateOutlet, ClickDirective],
    templateUrl: "./cards-manager.component.html",
    styleUrl: "./cards-manager.component.scss",
    animations: [animations],
})
export class CardsManagerComponent {
    readonly cards = new Array<{ content: CardContentDirective; position: Point; offset: Point }>();

    offset = Point();

    @Input() selected = 0;

    get currentCard() {
        return this.cards[this.selected]?.content;
    }

    @HostListener("window:wheel", ["$event"])
    onWheel(event: WheelEvent) {
        // if (event.deltaY > 0) this.selected = Math.min(this.selected + 1, (this.templates?.length ?? 0) - 1);
        // else this.selected = Math.max(this.selected - 1, 0);
        if (event.deltaY < 0 && this.cards.length > 1) this.pop();
    }

    getAnimation(index: number) {
        const distance = this.selected - index;
        const state = distance === 0 ? "current" : distance === 1 ? "behind" : distance > 1 ? "far" : "void";

        const {
            position: { x, y },
            offset: { x: ox, y: oy },
        } = this.cards[index];

        return { value: state, params: { x: x - ox, y: y - oy } };
    }

    push(
        content: CardContentDirective,
        { focus = true, position, from }: { focus?: boolean; position?: PointArgs; from?: RefProviderOptional } = {},
    ) {
        if (from) {
            const element = elementFromRef(from);
            if (element) position = Point(element.offsetLeft, element.offsetTop);
        }

        const pos = Point(position ?? 0);

        this.cards.push({ content, position: pos, offset: this.offset.copy() });

        this.offset.x -= pos.x;
        this.offset.y -= pos.y;

        if (focus) this.selected = this.cards.length - 1;
    }

    pop() {
        const element = this.cards.pop();
        if (!element) return;

        const { x, y } = element.position;

        this.offset.x += x;
        this.offset.y += y;

        this.selected = Math.max(this.selected - 1, 0);
    }

    @HostListener("window:keydown.escape")
    private onEscape() {
        if (this.currentCard.closeable) this.pop();
    }
}
