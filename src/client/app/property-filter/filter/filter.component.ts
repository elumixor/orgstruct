import { NgTemplateOutlet } from "@angular/common";
import { Component, computed, inject, model, type Signal } from "@angular/core";
import { TasksService } from "@services/tasks.service";
import { Filter, type IComparison, type IPropertyDescriptor, type IPropertyValue, type ITag, type Task } from "@shared";
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
    readonly tasksService = inject(TasksService);
    readonly comparisons = (["is", "is not", "in", "not in"] as IComparison[]).map((label) => ({
        label,
        value: label,
    }));

    readonly filter = model.required<Filter>();
    readonly properties = computed(
        () =>
            this.tasksService
                .properties()
                .values()
                .map((descriptor) => ({
                    label: descriptor.name,
                    icon: this.tasksService.propertyIcons.get(descriptor.type),
                    value: descriptor,
                }))
                .toArray() satisfies ISelectItem<IPropertyDescriptor>[],
    );

    private readonly type = computed(() => this.filter().property.type);
    readonly multiple = computed(() => {
        const comparison = this.filter().comparison;
        return comparison === "in" || comparison === "not in";
    });

    get property() {
        return [this.filter().property];
    }

    set property(value) {
        this.filter.update((f) => new Filter(f.label, value.first, f.filterItems, f.comparison));
    }

    get comparison() {
        return [this.filter().comparison];
    }
    set comparison(value) {
        const comparison = value.first;
        const multiple = comparison === "in" || comparison === "not in";

        let filterItems = this.filter().filterItems;
        if (!multiple && filterItems.length > 1) filterItems = [filterItems.first];

        this.filter.update((f) => new Filter(f.label, f.property, filterItems, comparison));
    }

    // set comparison(value) {
    //     const wasMultiple = this.isMultiple();
    //     this.filter().comparison = value;
    //     const isMultiple = this.isMultiple();

    //     if (wasMultiple === isMultiple) {
    //         this.filterItems = this.filter().filterItems; // to trigger the filter change
    //         return;
    //     }

    //     if (isMultiple) this.filterItems = [this.filterItems];
    //     else this.filterItems = (this.filterItems as unknown[])[0];
    // }

    readonly items = model;

    get filterItems() {
        return this.filter().filterItems as IPropertyValue<"text">[];
    }

    set filterItems(value) {
        this.filter.update((f) => new Filter(f.label, f.property, value, f.comparison));
    }

    //     const v =
    //         this.type === "tag"
    //             ? (task: Task) => (task.properties.get(this.property) as number[])[0]
    //             : (task: Task) => task.properties.get(this.property);

    //     const items =
    //         this.type === "tag"
    //             ? this.isMultiple()
    //                 ? (value as ITag[]).map(
    //                       (tag) => (this.property as IPropertyDescriptor<"tag">).parameters?.values.indexOf(tag) ?? -1,
    //                   )
    //                 : (this.property as IPropertyDescriptor<"tag">).parameters?.values.indexOf(value as ITag) ?? -1
    //             : value;

    //     const cmp = this.getCmp(items);

    //     this.filter.update((f) => ({
    //         ...f,
    //         predicate: (task) => {
    //             return cmp(v(task));
    //         },
    //     }));
    // }

    private readonly tagItems = computed(
        () =>
            ((this.filter().property as IPropertyDescriptor<"tag">).parameters?.values.map((value) => ({
                label: value.name,
                value,
            })) ?? []) satisfies ISelectItem<ITag>[],
    );

    private readonly relationItems = computed(
        () =>
            this.tasksService.tasks().map((task) => ({ label: task.name, value: task })) satisfies ISelectItem<Task>[],
    );

    private readonly textItems = computed(() => {
        const property = this.filter().property as IPropertyDescriptor<"text">;
        return this.tasksService
            .tasks()
            .values()
            .toArray()
            .flatMap((task) => {
                const value = task.properties.get(property);
                return value ? [{ label: value, value }] : [];
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

    // private getCmp(items: unknown) {
    //     switch (this.comparison) {
    //         case "is":
    //             return (value: unknown) => value === items;
    //         case "is not":
    //             return (value: unknown) => value !== items;
    //         case "in":
    //             return (value: unknown) => (items as unknown[]).includes(value);
    //         case "not in":
    //             return (value: unknown) => !(items as unknown[]).includes(value);
    //     }

    //     return () => true;
    // }
}
