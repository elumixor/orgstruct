import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ItemType } from "@domain";
import { DBEntry } from "@utils";

@Component({
    selector: "app-item",
    standalone: true,
    imports: [],
    templateUrl: "./item.component.html",
    styleUrl: "./item.component.scss",
})
export class ItemComponent {
    @Input({ required: true }) item!: DBEntry<ItemType>;
    @Output() remove = new EventEmitter();

    removeVisible = false;

    get image() {
        return "image" in this.item ? (this.item as { imageUrl?: string }).imageUrl : undefined;
    }

    get title() {
        return "title" in this.item ? this.item.title : "name" in this.item ? this.item.name : undefined;
    }
}
