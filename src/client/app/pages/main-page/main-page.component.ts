import { Component, inject } from "@angular/core";
import { TasksService } from "@services/tasks.service";
import { ButtonModule } from "primeng/button";
import { PanelModule } from "primeng/panel";
import { BoardListComponent } from "../../board-list/board-list.component";
import { BoardComponent } from "../../board/board.component";
import { TaskTableComponent } from "../../task-table/task-table.component";

@Component({
    selector: "app-main-page",
    standalone: true,
    imports: [TaskTableComponent, BoardComponent, BoardListComponent, PanelModule, ButtonModule],
    templateUrl: "./main-page.component.html",
    styleUrl: "./main-page.component.scss",
    animations: [],
})
export class MainPageComponent {
    private readonly tasksService = inject(TasksService);
    addProperty() {
        this.tasksService.addProperty();
    }
}
