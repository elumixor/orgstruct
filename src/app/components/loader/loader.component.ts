import { Component, Input } from "@angular/core";

@Component({
    selector: "app-loader",
    standalone: true,
    imports: [],
    templateUrl: "./loader.component.html",
    styleUrl: "./loader.component.scss",
})
export class LoaderComponent {
    @Input() text: string | null = "Loading...";
    @Input() width?: string;
    @Input() height?: string;
}
