import { Component, Input } from "@angular/core";

@Component({
    selector: "app-centered-content",
    standalone: true,
    imports: [],
    templateUrl: "./centered-content.component.html",
    styleUrl: "./centered-content.component.scss",
})
export class CenteredContentComponent {
    @Input() alignContent: "start" | "center" | "end" = "center";
}
