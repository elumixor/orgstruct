import { Component, computed, inject } from "@angular/core";
import { TasksService } from "@services/tasks.service";
import type { Task } from "@shared";
import { ComponentsModule } from "../components";
import { TaskRowComponent } from "./task-row/task-row.component";
import { PropertyPopupComponent } from "../property-editors/property-popup/property-popup.component";
import { TaskAddButtonComponent } from "./task-add-button/task-add-button.component";

@Component({
    selector: "app-task-table",
    standalone: true,
    imports: [ComponentsModule, TaskRowComponent, PropertyPopupComponent, TaskAddButtonComponent],
    templateUrl: "./task-table.component.html",
    styleUrl: "./task-table.component.scss",
})
export class TaskTableComponent {
    private readonly tasksService = inject(TasksService);

    readonly tasks = this.tasksService.taskTree;

    readonly properties = computed(() => {
        const descriptors = this.tasksService.properties().values().toArray();
        const childrenProperty = this.tasksService.childrenProperty();
        const parentsProperty = this.tasksService.parentsProperty();
        return descriptors.filter((p) => p !== childrenProperty && p !== parentsProperty);
    });

    addTask(parent?: Task) {
        this.tasksService.addTask(parent);
    }
}
