import { Component, computed, effect, inject, output } from "@angular/core";
import { TasksService } from "@services/tasks.service";
import type { Property } from "@shared";
import { ComponentsModule } from "../components";
import { signalSet } from "../utils";

@Component({
    selector: "app-property-manager",
    standalone: true,
    imports: [ComponentsModule],
    templateUrl: "./property-manager.component.html",
    styleUrl: "./property-manager.component.scss",
})
export class PropertyManagerComponent {
    private readonly tasksService = inject(TasksService);
    readonly properties = computed(() => this.tasksService.properties().values().toArray());
    readonly hidden = signalSet<Property>();
    readonly updated = output<Property[]>();

    constructor() {
        effect(() => {
            const props = this.properties();
            const hidden = this.hidden();
            this.updated.emit(props.filter((p) => !hidden.has(p)));
        });
    }
}
