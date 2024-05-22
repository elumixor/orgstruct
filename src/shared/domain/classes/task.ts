import { computed, signal, type WritableSignal } from "@angular/core";
import type { PropertyType, PropertyValue } from "../property-types";
import type { Property } from "./property";
import type { ToIds } from "@domain/responses";

export interface PropertyMap extends Map<Property, WritableSignal<PropertyValue>> {
    get<T extends PropertyType>(key: Property<T>): WritableSignal<PropertyValue<T>>;
    set<T extends PropertyType>(key: Property<T>, value: WritableSignal<PropertyValue<T>>): this;
}

export class Task {
    readonly id;
    readonly name = this.properties.get(this.nameProperty);
    readonly children = this.properties.get(this.childrenProperty);
    readonly parents = this.properties.get(this.parentsProperty);
    readonly topLevel = computed(() => this.parents().isEmpty);
    readonly hasChildren = computed(() => this.children().nonEmpty);
    readonly serialized = computed(() => ({
        id: this.id(),
        properties: this.properties
            .entries()
            .map(([property, value]) => ({ id: property.id(), value: toPlain(property.type(), value()) }))
            .toArray(),
    }));
    constructor(
        id: number,
        readonly properties: PropertyMap,
        readonly nameProperty: Property<"text">,
        readonly childrenProperty: Property<"relation">,
        readonly parentsProperty: Property<"relation">,
    ) {
        this.id = signal(id);
    }
}

function toPlain<T extends PropertyType>(type: T, value: PropertyValue<T>): ToIds<PropertyValue<T>> {
    switch (type) {
        case "text":
            return value as ToIds<PropertyValue<T>>;
        case "relation":
            return (value as PropertyValue<"relation">).map((task) => task.id()) as ToIds<PropertyValue<T>>;
        case "tag":
            return (value as PropertyValue<"tag">).map((tag) => tag.id) as ToIds<PropertyValue<T>>;
    }

    throw new Error(`Unknown property type: ${type}`);
}
