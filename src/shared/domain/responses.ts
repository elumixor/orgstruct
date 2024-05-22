import type { PropertyType, PropertyValue } from "./property-types";
import type { ITag } from "./tag";
import type { Task } from "./classes/task";
import type { Property } from "./classes";

export type ToIds<T> = T extends Task[] ? number[] : T extends ITag[] ? number[] : T;

export interface TaskResponse<T extends PropertyType = PropertyType> {
    id: number;
    properties: Record<string, ToIds<PropertyValue<T>>>;
}

export type PropertyResponse<T extends PropertyType = PropertyType> = ConstructorParameters<typeof Property<T>>[0];
