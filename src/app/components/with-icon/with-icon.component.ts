import { Component, Input } from "@angular/core";
import { IconComponent } from "@components";

@Component({
    selector: "app-with-icon",
    standalone: true,
    imports: [IconComponent],
    templateUrl: "./with-icon.component.html",
    styleUrl: "./with-icon.component.scss",
})
export class WithIconComponent {
    @Input() icon?: string;
    @Input() color = "white";
    @Input() size = "1em";
}
