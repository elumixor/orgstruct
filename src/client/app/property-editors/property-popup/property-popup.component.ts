import { Component, computed, inject, input, output } from "@angular/core";
import { TasksService } from "@services/tasks.service";
import type { IPropertyDescriptor, IPropertyType } from "@shared";
import { ComponentsModule } from "../../components";
import type { ISelectItem } from "../../components/select/select.component";

@Component({
    selector: "app-property-popup",
    standalone: true,
    imports: [ComponentsModule],
    templateUrl: "./property-popup.component.html",
    styleUrl: "./property-popup.component.scss",
})
export class PropertyPopupComponent {
    readonly deleted = output<boolean>();
    readonly descriptor = input.required<IPropertyDescriptor>();
    readonly tasksService = inject(TasksService);

    readonly isTitle = computed(() => this.tasksService.nameProperty() === this.descriptor());

    readonly types = this.tasksService.propertyIcons
        .entries()
        .map(([type, icon]) => ({
            label: type.capitalize(),
            value: type,
            icon,
        }))
        .toArray() satisfies ISelectItem<IPropertyType>[];

    get type() {
        return [this.descriptor().type];
    }
    set type(value: IPropertyType[]) {
        // We need more complex logic here, coercing the types, etc.
        this.descriptor().type = value.first;
    }

    get availableTags() {
        return this.tagDescriptor.parameters!.values;
    }

    // For type casting
    get tagDescriptor() {
        return this.descriptor() as IPropertyDescriptor<"tag">;
    }

    deleteProperty() {
        this.tasksService.deleteProperty(this.descriptor());
        this.deleted.emit(true);
    }
}
