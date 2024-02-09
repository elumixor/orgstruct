import { Component, HostBinding, Input } from "@angular/core";
import { flyInOutAnimation } from "@animations";

@Component({
    selector: "app-loader",
    standalone: true,
    imports: [],
    templateUrl: "./loader.component.html",
    styleUrl: "./loader.component.scss",
    animations: [flyInOutAnimation],
})
export class LoaderComponent {
    @Input() text: string | null = "Loading...";
    @HostBinding("@flyInOut") flyInOut = true;
    @Input() width?: string;
    @Input() height?: string;
}
