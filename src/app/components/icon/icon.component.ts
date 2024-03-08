import { NgStyle } from "@angular/common";
import { Component, Input } from "@angular/core";
import { parseColor } from "@utils";

@Component({
    selector: "app-icon",
    standalone: true,
    imports: [NgStyle],
    templateUrl: "./icon.component.html",
    styleUrl: "./icon.component.scss",
})
export class IconComponent {
    @Input({ required: true }) src!: string;
    @Input() color = "black";
    @Input() size?: string;

    get style() {
        const maskImage = `url(assets/images/${this.src})`;
        const options = {
            "mask-image": maskImage,
            "-webkit-mask-image": maskImage,
            "background-color": parseColor(this.color),
        } as Record<string, string>;

        if (this.size) {
            options["width"] = this.size;
            options["height"] = this.size;
        }

        return options;
    }
}
