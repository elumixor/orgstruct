import { computed, signal } from "@angular/core";
import type { PropertyParameters } from "../property-parameters";
import type { PropertyType } from "../property-types";

export class Property<T extends PropertyType = PropertyType> {
    readonly id;
    readonly name;
    readonly type;
    readonly parameters;
    readonly icon;
    readonly serialized = computed(() => ({
        id: this.id(),
        name: this.name(),
        type: this.type(),
        parameters: this.parameters(),
        icon: this.icon(),
    }));

    constructor(params: {
        id: number;
        name: string;
        type: T;
        parameters: PropertyParameters<T> | undefined;
        icon: string | undefined;
    }) {
        this.id = signal(params.id);
        this.name = signal(params.name);
        this.type = signal(params.type);
        this.parameters = signal(params.parameters);
        this.icon = signal(params.icon);
    }
}
