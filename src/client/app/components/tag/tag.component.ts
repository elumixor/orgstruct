import { Component, computed, input } from "@angular/core";
import type { ITag } from "@shared";
import tinycolor from "tinycolor2";

@Component({
    selector: "app-tag",
    standalone: true,
    imports: [],
    templateUrl: "./tag.component.html",
    styleUrl: "./tag.component.scss",
})
export class TagComponent {
    readonly tag = input.required<ITag>();
    readonly label = computed(() => this.tag().name);
    readonly style = computed(() => {
        const tag = this.tag();
        return {
            backgroundColor: tag.color,
            color: tinycolor.mostReadable(tag.color, ["#000", "#fff"]).toHexString(),
        };
    });
}
