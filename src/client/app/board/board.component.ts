import { Component, input } from "@angular/core";
import { PanelModule } from "primeng/panel";

@Component({
    selector: "app-board",
    standalone: true,
    imports: [PanelModule],
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.scss",
})
export class BoardComponent {
    readonly header = input("Board");
}
