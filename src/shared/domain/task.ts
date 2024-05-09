export interface ITaskResponse {
    id: string;
    properties: Record<string, Task2Id<IPropertyValue>>;
}

type Task2Id<T> = T extends Task[] ? string[] : T extends ITag[] ? number[] : T;

export interface PropertyMap extends Map<IPropertyDescriptor, IPropertyValue> {
    get<T extends IPropertyType>(key: IPropertyDescriptor<T>): IPropertyValue<T>;
    set<T extends IPropertyType>(key: IPropertyDescriptor<T>, value: IPropertyValue<T>): this;
}

export class Task {
    constructor(
        readonly id: string,
        readonly properties: PropertyMap,
        readonly nameProperty: IPropertyDescriptor<"text">,
        readonly childrenProperty: IPropertyDescriptor<"relation">,
        readonly parentsProperty: IPropertyDescriptor<"relation">,
    ) {}

    get name() {
        return this.properties.get(this.nameProperty);
    }
    set name(value: string) {
        this.properties.set(this.nameProperty, value);
    }

    get children() {
        return this.properties.get(this.childrenProperty);
    }
    set children(value: Task[]) {
        this.properties.set(this.childrenProperty, value);
    }

    get parents() {
        return this.properties.get(this.parentsProperty);
    }
    set parents(value: Task[]) {
        this.properties.set(this.parentsProperty, value);
    }
}

export interface IPropertyDescriptors {
    text: { value: string };
    relation: { value: Task[] };
    moment: { value: Date | undefined };
    interval: { value: { start: Date; end: Date } };
    tag: { value: ITag[]; parameters: { multiple: boolean; values: ITag[] } }; // indices of the selected tags
}

export type IPropertyType = keyof IPropertyDescriptors;
export type IPropertyValue<T extends IPropertyType = IPropertyType> = IPropertyDescriptors[T]["value"];

export interface IPropertyDescriptor<T extends IPropertyType = IPropertyType> {
    id: string;
    name: string;
    icon?: string;
    type: T;
    parameters?: IPropertyDescriptors[T] extends { parameters: infer M } ? M : unknown;
}

export interface ITag {
    name: string;
    color: string;
}

// equals, in, not in, not equals, greater than, less than, etc.
// for each type we have a list of predicates
// each has a name and a specified view
// the view is meant to configure the predicate
export class Filter<T extends IPropertyType = IPropertyType> {
    constructor(
        readonly label: string,
        readonly property: IPropertyDescriptor<T>,
        readonly filterItems: Flat<IPropertyValue<T>>[],
        readonly comparison: IComparison,
    ) {}
    predicate(task: Task) {
        const value = task.properties.get(this.property);
        if (this.property.type === "tag" || this.property.type === "relation")
            return (value as unknown[]).some((v) => this.isOk(v));
        return this.isOk(value);
    }

    private isOk(value: unknown) {
        switch (this.comparison) {
            case "is":
                return this.filterItems.first === value;
            case "is not":
                return this.filterItems.first !== value;
            case "in":
                return this.filterItems.includes(value as Flat<IPropertyValue<T>>);
            case "not in":
                return !this.filterItems.includes(value as Flat<IPropertyValue<T>>);
        }
    }
}

export type Flat<T> = T extends (infer U)[] ? U : T;

export type IComparison = "is" | "is not" | "in" | "not in";

export interface IBoardData {
    namePropertyId: string;
    childrenPropertyId: string;
    parentsPropertyId: string;
}
