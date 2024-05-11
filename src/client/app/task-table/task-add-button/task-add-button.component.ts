import { Component, input, output } from "@angular/core";
import { ComponentsModule } from "../../components";

@Component({
    selector: "app-task-add-button",
    standalone: true,
    imports: [ComponentsModule],
    templateUrl: "./task-add-button.component.html",
    styleUrl: "./task-add-button.component.scss",
})
export class TaskAddButtonComponent {
    readonly clicked = output();
    readonly level = input(0);
    readonly first = input(false);
}
