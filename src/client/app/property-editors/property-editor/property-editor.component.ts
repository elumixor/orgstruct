import { Component, computed, inject, input, model } from "@angular/core";
import { TasksService } from "@services/tasks.service";
import { Task, type IPropertyDescriptor, type ITag, type PropertyMap } from "@shared";
import { ComponentsModule } from "../../components";
import type { ISelectItem } from "../../components/select/select.component";

@Component({
    selector: "app-property-editor",
    standalone: true,
    imports: [ComponentsModule],
    templateUrl: "./property-editor.component.html",
    styleUrl: "./property-editor.component.scss",
})
export class PropertyEditorComponent<T extends IPropertyDescriptor> {
    readonly property = input.required<T>();
    readonly task = model.required<Task>();

    private readonly tasksService = inject(TasksService);

    readonly type = computed(() => this.property().type);

    get value() {
        return this.task().properties.get(this.property());
    }
    set value(value) {
        this.task.update((t) => {
            const properties = t.properties;
            t.properties.set(this.property(), value);

            return new Task(
                t.id,
                new Map(properties) as PropertyMap,
                t.nameProperty,
                t.childrenProperty,
                t.parentsProperty,
            );
        });
    }

    get tags() {
        return this.value as ITag[];
    }
    set tags(value) {
        this.value = value;
    }

    get relations() {
        return this.value as Task[];
    }
    set relations(value) {
        this.value = value;
    }

    get availableTags() {
        const descriptor = this.property() as IPropertyDescriptor<"tag">;
        return descriptor
            .parameters!.values.values()
            .map((value) => ({ label: value.label.capitalize(), value }))
            .toArray();
    }

    get multipleTags() {
        const descriptor = this.property() as IPropertyDescriptor<"tag">;
        return descriptor.parameters!.multiple;
    }

    get availableRelations() {
        return this.tasksService.tasks().map((t) => ({ label: t.name, value: t })) as unknown as ISelectItem<Task>[];
    }
}
