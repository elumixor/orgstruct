import { Component, computed, inject, input, model } from "@angular/core";
import { TasksService } from "@services/tasks.service";
import type { Task } from "@shared";
import { ComponentsModule } from "../../components";
import { PropertyEditorComponent } from "../../property-editors/property-editor/property-editor.component";
import { TaskAddButtonComponent } from "../task-add-button/task-add-button.component";
import { TaskTableComponent } from "../task-table.component";
import { NgTemplateOutlet } from "@angular/common";

@Component({
    selector: "app-task-row",
    standalone: true,
    imports: [ComponentsModule, PropertyEditorComponent, TaskAddButtonComponent, NgTemplateOutlet],
    templateUrl: "./task-row.component.html",
    styleUrl: "./task-row.component.scss",
})
export class TaskRowComponent {
    readonly task = input.required<Task>();
    readonly parent = input<Task>();
    readonly open = model(false);
    readonly level = input(0);
    readonly properties = inject(TaskTableComponent).properties;
    readonly arrowIcon = computed(() => `pi ${this.open() ? "pi-angle-down" : "pi-angle-right"}`);
    readonly arrowDynamic = computed(() => !this.task().hasChildren() && !this.open());

    private readonly tasksService = inject(TasksService);

    toggle() {
        this.open.update((v) => !v);
    }

    addTask() {
        this.tasksService.addTask(this.task());
    }

    deleteTask() {
        this.tasksService.deleteTask(this.task());
    }
}
