import { NgTemplateOutlet } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TasksService } from "@services/tasks.service";
// import type { ITask } from "@shared";
import type { Task } from "@shared";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PopupContentDirective } from "../components/popup/popup-content.directive";
import { PopupComponent } from "../components/popup/popup.component";
import { PropertyEditorComponent } from "../property-editors/property-editor/property-editor.component";
import { PropertyPopupComponent } from "../property-editors/property-popup/property-popup.component";

@Component({
    selector: "app-task-table",
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        NgTemplateOutlet,
        InputTextModule,
        PropertyEditorComponent,
        PopupComponent,
        PropertyPopupComponent,
        PopupContentDirective,
    ],
    templateUrl: "./task-table.component.html",
    styleUrl: "./task-table.component.scss",
})
export class TaskTableComponent {
    private readonly tasksService = inject(TasksService);

    get tasks() {
        return this.tasksService.taskTree();
    }

    readonly descriptors = computed(() => {
        const descriptors = this.tasksService.properties().values().toArray();
        const childrenProperty = this.tasksService.childrenProperty();
        const parentsProperty = this.tasksService.parentsProperty();

        return descriptors.filter((p) => p !== childrenProperty && p !== parentsProperty);
    });

    private readonly openMap = new Map<string, boolean>();

    isOpen(row: { data: Task }) {
        return this.openMap.get(row.data.id);
    }

    toggle(row: { data: Task }) {
        const { id } = row.data;
        this.openMap.set(id, !this.openMap.get(id));
    }

    addTask(parent?: Task) {
        this.tasksService.addTask(parent);
    }
}
