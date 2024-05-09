import { Component, computed, inject, model, signal } from "@angular/core";
import { TasksService } from "@services/tasks.service";
import type { Filter, IPropertyDescriptor, Task } from "@shared";
import { BoardCardComponent } from "../board-card/board-card.component";
import { ComponentsModule } from "../components/components.module";
import { PropertyFilterComponent } from "../property-filter/property-filter.component";
import { PropertyManagerComponent } from "../property-manager/property-manager.component";
import { FilterComponent } from "../property-filter/filter/filter.component";

@Component({
    selector: "app-board-list",
    standalone: true,
    imports: [BoardCardComponent, ComponentsModule, FilterComponent, PropertyManagerComponent, PropertyFilterComponent],
    templateUrl: "./board-list.component.html",
    styleUrl: "./board-list.component.scss",
})
export class BoardListComponent {
    readonly title = model("Board List");

    readonly visibleProperties = signal<IPropertyDescriptor[]>([]);
    readonly filteredTasks = signal<Task[]>([]);

    drop(item: unknown) {
        // this.items.push(item);
    }

    dragStart(event: unknown) {
        // console.log(event);
    }
}
