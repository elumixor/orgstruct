import { Component, Input } from "@angular/core";
import { EditableComponent } from "@components";
import type { MetaPlain } from "@domain";

@Component({
    selector: "app-task",
    standalone: true,
    imports: [EditableComponent],
    templateUrl: "./task.component.html",
    styleUrl: "./task.component.scss",
})
export class TaskComponent {
    @Input({ required: true }) task!: MetaPlain<"task">;
}
