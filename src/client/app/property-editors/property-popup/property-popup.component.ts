import { Component, computed, inject, input, output } from "@angular/core";
import { TasksService } from "@services/tasks.service";
import type { ITag, Property, PropertyType } from "@shared";
import { ComponentsModule } from "../../components";
import type { ISelectItem } from "../../components/select/select.component";
import { nonNull } from "@elumixor/frontils";

@Component({
    selector: "app-property-popup",
    standalone: true,
    imports: [ComponentsModule],
    templateUrl: "./property-popup.component.html",
    styleUrl: "./property-popup.component.scss",
})
export class PropertyPopupComponent {
    readonly deleted = output<boolean>();
    readonly property = input.required<Property>();
    readonly tasksService = inject(TasksService);

    readonly isTitle = computed(() => this.tasksService.nameProperty() === this.property());

    readonly types = Object.entries(this.tasksService.propertyIcons).map(([type, icon]) => ({
        label: type.capitalize(),
        value: type as PropertyType,
        icon,
    })) satisfies ISelectItem<PropertyType>[];

    get type() {
        return [this.property().type()];
    }
    set type(value: PropertyType[]) {
        // We need more complex logic here, coercing the types, etc.
        this.property().type.set(value.first);
    }

    get availableTags() {
        return Object.values(nonNull(this.tagProperty.parameters()).values);
    }

    // For type casting
    get tagProperty() {
        return this.property() as Property<"tag">;
    }

    deleteTag(tag: ITag) {
        this.tagProperty.parameters.update((p) => ({
            multiple: p!.multiple,
            values: Object.fromEntries(Object.entries(p!.values).filter(([, value]) => value !== tag)),
        }));
    }

    deleteProperty() {
        this.tasksService.deleteProperty(this.property());
        this.deleted.emit(true);
    }
}
