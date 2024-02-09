import { Component, Input } from "@angular/core";
import { CenteredContentComponent, SearchBarComponent } from "@components";
import { Identifier, ItemType } from "@domain";
// import { search } from "fast-fuzzy";
import { NetworkService } from "../../services/network.service";
import { NewItemButtonComponent } from "./new-item/button/button.component";
import { ItemComponent } from "./item/item/item.component";

@Component({
    selector: "app-items",
    standalone: true,
    imports: [CenteredContentComponent, SearchBarComponent, ItemComponent, NewItemButtonComponent],
    templateUrl: "./items.component.html",
    styleUrl: "./items.component.scss",
})
export class ItemsComponent {
    @Input() query = "";

    // readonly items;
    // readonly plurals = item2database;
    // readonly itemCategories = Object.keys(item2database) as ItemType[];

    constructor(private readonly network: NetworkService) {
        // this.items = network.data;
    }

    matches() {
        // let items: DBEntry<ItemObject>[];
        // if (!this.query) items = this.items();
        // else {
        //     const targets = this.items().map((item) => {
        //         const title = "title" in item ? item.title : "name" in item ? item.name : "";
        //         return { title, item };
        //     });
        //     items = search(this.query, targets, { keySelector: (target) => target.title }).map((result) => result.item);
        // }
        // Group them by type
        // return this.itemCategories.map((type) => [type, items.filter((item) => item.type === type)] as const);
    }

    remove<T extends ItemType>(itemType: T, id: Identifier) {
        void this.network.delete(itemType, id);
    }
}
