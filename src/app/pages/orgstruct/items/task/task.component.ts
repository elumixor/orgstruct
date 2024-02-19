import { Component, Input } from "@angular/core";
import type { MetaPlain } from "@utils";

@Component({
    selector: "app-task",
    standalone: true,
    imports: [],
    templateUrl: "./task.component.html",
    styleUrl: "./task.component.scss",
})
export class TaskComponent {
    @Input({ required: true }) task!: MetaPlain<"task">;
}
