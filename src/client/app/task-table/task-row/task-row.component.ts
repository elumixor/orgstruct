import { Component, inject, input } from "@angular/core";
import { TasksService, type IProcessedTask } from "@services/tasks.service";
import { ComponentsModule } from "../../components";
import { PropertyEditorComponent } from "../../property-editors/property-editor/property-editor.component";
import { TaskTableComponent } from "../task-table.component";
import { TaskAddButtonComponent } from "../task-add-button/task-add-button.component";

@Component({
    selector: "app-task-row",
    standalone: true,
    imports: [ComponentsModule, PropertyEditorComponent, TaskAddButtonComponent],
    templateUrl: "./task-row.component.html",
    styleUrl: "./task-row.component.scss",
})
export class TaskRowComponent {
    readonly task = input.required<IProcessedTask>();
    readonly parent = input<IProcessedTask>();
    readonly level = input(0);
    readonly properties = inject(TaskTableComponent).properties;
    private readonly tasksService = inject(TasksService);

    get open() {
        return this.task().open;
    }

    set open(value) {
        this.task().open = value;
    }

    toggle() {
        this.open = !this.open;
    }

    addTask() {
        this.tasksService.addTask(this.parent()?.data);
    }
}
