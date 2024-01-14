import { Component, Input } from "@angular/core";
import { AutoFitTextComponent } from "../auto-fit-text/auto-fit-text.component";

@Component({
    selector: "app-image-with-text",
    standalone: true,
    imports: [AutoFitTextComponent],
    templateUrl: "./image-with-text.component.html",
    styleUrl: "./image-with-text.component.scss",
})
export class ImageWithTextComponent {
    @Input() text = "";
    @Input() image?: string;
    @Input() justifyContent: "center" | "flex-start" | "flex-end" = "flex-start";
}
