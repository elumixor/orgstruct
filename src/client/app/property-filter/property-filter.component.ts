import { Component, effect, inject, output, signal } from "@angular/core";
import { TasksService } from "@services/tasks.service";
import type { Filter, Task } from "@shared";
import { ComponentsModule } from "../components";
import { FilterComponent } from "./filter/filter.component";

@Component({
    selector: "app-property-filter",
    standalone: true,
    imports: [ComponentsModule, FilterComponent],
    templateUrl: "./property-filter.component.html",
    styleUrl: "./property-filter.component.scss",
})
export class PropertyFilterComponent {
    private readonly tasksService = inject(TasksService);
    readonly tasks = this.tasksService.tasks;
    readonly filters = signal([] as Filter[]);
    readonly updated = output<Task[]>();

    constructor() {
        effect(() => {
            const tasks = this.tasks();
            const filters = this.filters();
            const filteredTasks = tasks
                .values()
                .toArray()
                .filter((task) => filters.every((filter) => filter.predicate(task)));

            this.updated.emit(filteredTasks);
        });
    }

    addFilter() {
        this.filters.update((f) => [...f, this.tasksService.defaultFilter()]);
    }

    updateFilters(filter: Filter, index: number) {
        this.filters.update((f) => f.map((f1, i) => (i === index ? filter : f1)));
    }
}
