import { NgTemplateOutlet } from "@angular/common";
import { Component, computed, inject, model, type Signal } from "@angular/core";
import { nonNull } from "@elumixor/frontils";
import { TasksService } from "@services/tasks.service";
import { Filter, comparisons, type Comparison, type ITag, type Property, type PropertyValue, type Task } from "@shared";
import { ComponentsModule } from "../../components";
import type { ISelectItem } from "../../components/select/select.component";

@Component({
    selector: "app-filter",
    standalone: true,
    imports: [ComponentsModule, NgTemplateOutlet],
    templateUrl: "./filter.component.html",
    styleUrl: "./filter.component.scss",
})
export class FilterComponent {
    private readonly tasksService = inject(TasksService);
    readonly comparisons = comparisons.map((label) => ({ label, value: label })) satisfies ISelectItem<Comparison>[];

    readonly filter = model.required<Filter>();
    readonly properties = computed(
        () =>
            this.tasksService
                .properties()
                .values()
                .map((descriptor) => ({
                    label: descriptor.name(),
                    icon: descriptor.icon(),
                    value: descriptor,
                }))
                .toArray() satisfies ISelectItem<Property>[],
    );

    private readonly type = computed(() => this.filter().property().type());
    readonly multiple = computed(() => this.filter().multiple());

    get property() {
        return [this.filter().property()];
    }
    set property(value) {
        this.filter().property.set(value.first);
    }

    get comparison() {
        return [this.filter().comparison()];
    }
    set comparison(value) {
        const comparison = value.first;
        const multiple = comparison === "in" || comparison === "not in";

        let filterItems = this.filter().filterItems();
        if (!multiple && filterItems.length > 1) filterItems = [filterItems.first];

        this.filter().filterItems.set(filterItems);
    }

    get filterItems() {
        return this.filter().filterItems() as PropertyValue<"text">[];
    }
    set filterItems(value) {
        this.filter().filterItems.set(value);
    }

    private readonly tagItems = computed(
        () =>
            Object.values(nonNull((this.filter().property() as Property<"tag">).parameters()).values).map((value) => ({
                label: value.label,
                value,
            })) satisfies ISelectItem<ITag>[],
    );

    private readonly relationItems = computed(
        () =>
            this.tasksService
                .tasks()
                .map((task) => ({ label: task.name(), value: task })) satisfies ISelectItem<Task>[],
    );

    private readonly textItems = computed(() => {
        const property = this.filter().property() as Property<"text">;
        return this.tasksService
            .tasks()
            .values()
            .toArray()
            .flatMap((task) => {
                const value = task.properties.get(property);
                return value ? [{ label: value(), value: value() }] : [];
            }) satisfies ISelectItem<string>[];
    });

    readonly possibleItems: Signal<ISelectItem<string | ITag | Task>[]> = computed(() => {
        switch (this.type()) {
            case "tag":
                return this.tagItems();
            case "relation":
                return this.relationItems();
            case "text":
                return this.textItems();
            default:
                return [];
        }
    });
}
