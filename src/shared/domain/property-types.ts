import type { ITag } from "./tag";
import type { Task } from "./classes/task";

export const propertyTypes = [
    "text",
    "relation",
    "tag",
    // "moment",
    // "interval"
] as const;

export type PropertyType = (typeof propertyTypes)[number];

interface IPropertyValues {
    text: string;
    relation: Task[];
    tag: ITag[];

    // moment: { value: Date };
    // interval: { value: { start: Date; end: Date } };
}

export type PropertyValue<T extends PropertyType = PropertyType> = IPropertyValues[T];
