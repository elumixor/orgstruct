import { Component, computed, inject, input } from "@angular/core";
import { nonNull } from "@elumixor/frontils";
import { TasksService } from "@services/tasks.service";
import { Property, Task, type ITag } from "@shared";
import { ComponentsModule } from "../../components";
import type { ISelectItem } from "../../components/select/select.component";

@Component({
    selector: "app-property-editor",
    standalone: true,
    imports: [ComponentsModule],
    templateUrl: "./property-editor.component.html",
    styleUrl: "./property-editor.component.scss",
})
export class PropertyEditorComponent<T extends Property> {
    readonly task = input.required<Task>();
    readonly property = input.required<T>();

    private readonly tasksService = inject(TasksService);

    readonly type = computed(() => this.property().type());

    private readonly _value = computed(() => this.task().properties.get(this.property()));

    get value() {
        return this._value()();
    }
    set value(value) {
        this._value().set(value);

        this.tasksService.updateTask(this.task(), this.property());
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
        const descriptor = this.property() as Property<"tag">;
        return Object.values(nonNull(descriptor.parameters()).values).map((value) => ({
            label: value.label.capitalize(),
            value,
        })) satisfies ISelectItem<ITag>[];
    }

    get multipleTags() {
        const descriptor = this.property() as Property<"tag">;
        return nonNull(descriptor.parameters()).multiple;
    }

    get availableRelations() {
        return this.tasksService.tasks().map((t) => ({ label: t.name(), value: t })) satisfies ISelectItem<Task>[];
    }
}
