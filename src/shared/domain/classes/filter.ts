import { computed, signal } from "@angular/core";
import type { PropertyType, PropertyValue } from "../property-types";
import type { Property } from "./property";
import { Task } from "./task";

export const comparisons = ["is", "is not", "in", "not in"] as const;
export type Comparison = (typeof comparisons)[number];
type Flat<T> = T extends (infer U)[] ? U : T;

export class Filter<T extends PropertyType = PropertyType> {
    readonly label;
    readonly property;
    readonly filterItems;
    readonly comparison;

    readonly multiple = computed(() => {
        const comparison = this.comparison();
        return comparison === "in" || comparison === "not in";
    });

    constructor(label: string, property: Property<T>, filterItems: Flat<PropertyValue<T>>[], comparison: Comparison) {
        this.label = signal(label);
        this.property = signal(property);
        this.filterItems = signal(filterItems);
        this.comparison = signal(comparison);
    }

    predicate(task: Task) {
        const value = task.properties.get(this.property());
        if (this.property().type() === "tag" || this.property().type() === "relation")
            return (value() as unknown[]).some((v) => this.isOk(v));
        return this.isOk(value);
    }

    private isOk(value: unknown) {
        switch (this.comparison()) {
            case "is":
                return this.filterItems().first === value;
            case "is not":
                return this.filterItems().first !== value;
            case "in":
                return this.filterItems().includes(value as Flat<PropertyValue<T>>);
            case "not in":
                return !this.filterItems().includes(value as Flat<PropertyValue<T>>);
        }
    }
}
