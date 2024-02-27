import { NgStyle } from "@angular/common";
import { Component, Input } from "@angular/core";

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

    get style() {
        const maskImage = `url(assets/images/${this.src})`;
        return {
            "mask-image": maskImage,
            "-webkit-mask-image": maskImage,
            "background-color": this.color,
        };
    }
}
