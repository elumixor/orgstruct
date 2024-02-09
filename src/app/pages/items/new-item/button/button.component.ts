import { Component, ElementRef, ViewChild } from "@angular/core";
import { ImageWithTextComponent } from "@components";
import { ItemType } from "@domain";
import { NetworkService } from "@services/network.service";

@Component({
    selector: "app-new-item-button",
    standalone: true,
    imports: [ImageWithTextComponent],
    templateUrl: "./button.component.html",
    styleUrl: "./button.component.scss",
})
export class NewItemButtonComponent {
    @ViewChild("button") button?: ElementRef<HTMLButtonElement>;
    @ViewChild("bar") bar?: ElementRef<HTMLDivElement>;

    private _barVisible = false;

    constructor(private readonly network: NetworkService) {}

    get barVisible() {
        return this._barVisible;
    }

    set barVisible(value) {
        this._barVisible = value;

        if (value && this.button && this.bar) {
            // Compute the bounding boxes
            const selfBBox = this.bar.nativeElement.getBoundingClientRect();
            const anchorBBox = this.button.nativeElement.getBoundingClientRect();

            let targetX = 0;
            let targetY = 0;
            if (anchorBBox && selfBBox) {
                const { x, y, width, height } = anchorBBox;
                const { width: selfWidth, height: selfHeight } = selfBBox;

                targetX = x + width / 2 - selfWidth / 2;
                targetY = y + height / 2 - selfHeight / 2;
            }

            // Set the position
            this.bar.nativeElement.style.left = targetX + "px";
            this.bar.nativeElement.style.top = targetY + "px";
        }
    }

    create(type: ItemType) {
        // const db = useContext(DBContext);
        // this.network.create(type);
        console.log("creating " + type);
        // console.log(db);
        // await db?.create(type);
        // await db?.refresh();
    }
}
