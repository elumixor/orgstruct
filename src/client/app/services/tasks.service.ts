import { Injectable, computed, inject, signal } from "@angular/core";
import {
    Filter,
    Property,
    Task,
    type IBoardData,
    type ITag,
    type PropertyMap,
    type PropertyType,
    type PropertyValue,
} from "@domain";
import { all, nonNull } from "@elumixor/frontils";
import { schedule, signalArray, signalMap } from "../utils";
import { NetworkService } from "./network.service";

/**
 * Manages tasks
 */
@Injectable({
    providedIn: "root",
})
export class TasksService {
    readonly propertyIcons: Record<PropertyType, string> = {
        text: "pi pi-align-left",
        relation: "pi pi-link",
        tag: "pi pi-tag",
        // ["moment", "pi pi-calendar"],
        // ["interval", "pi pi-clock"],
    };

    private readonly network = inject(NetworkService);

    private readonly boardData = signal<IBoardData | undefined>(undefined);
    readonly properties = signalMap<number, Property>();
    readonly tasks = signalArray<Task>();

    // Special properties
    readonly nameProperty = computed(() => {
        const namePropertyId = this.boardData()?.namePropertyId;
        if (!namePropertyId) return undefined;
        return this.properties.get(namePropertyId) as Property<"text">;
    });
    readonly childrenProperty = computed(() => {
        const childrenPropertyId = this.boardData()?.childrenPropertyId;
        if (!childrenPropertyId) return undefined;
        return (this.properties.get(childrenPropertyId) ?? []) as Property<"relation">;
    });
    readonly parentsProperty = computed(() => {
        const parentsPropertyId = this.boardData()?.parentsPropertyId;
        if (!parentsPropertyId) return undefined;
        return (this.properties.get(parentsPropertyId) ?? []) as Property<"relation">;
    });

    private async initialize() {
        // Get initial data from the server
        const [tasks, propertiesRaw, boardData] = await all(
            this.network.getTasks(),
            this.network.getProperties(),
            this.network.getBoardData(),
        );

        // Fill the board data
        this.boardData.set(boardData);

        // Fill the property descriptor map
        const properties = new Map(
            propertiesRaw.map(({ id, name, type, parameters }) => [
                id,
                new Property({ id, name, type, parameters, icon: this.propertyIcons[type] }),
            ]),
        );
        this.properties.set(properties);

        const nameProperty = this.nameProperty()!;
        const childrenProperty = this.childrenProperty()!;
        const parentsProperty = this.parentsProperty()!;

        // Create a map id -> Task
        const processedTasks = new Map(
            tasks.map(({ id, properties }) => {
                const values = new Map(
                    this.properties()
                        .entries()
                        .map(([key, descriptor]) => [descriptor, signal(properties[key])]),
                ) as PropertyMap;

                return [id, new Task(id, values, nameProperty, childrenProperty, parentsProperty)];
            }),
        );

        // For all tasks, change relations from id to Task
        // Also, replace tag indices with actual values
        const tagProperties = this.properties()
            .values()
            .filter((d) => d.type() === "tag")
            .toArray() as Property<"tag">[];

        for (const task of processedTasks.values()) {
            // Replace children ids with actual objects id -> Task
            task.children.update((children) =>
                children.map((id) => nonNull(processedTasks.get(id as unknown as number))),
            );
            // same for the parents
            task.parents.update((parents) => parents.map((id) => nonNull(processedTasks.get(id as unknown as number))));

            // For each tag property available, replace all tag values with id -> ITag
            for (const tagProperty of tagProperties) {
                const selectedTags = task.properties.get(tagProperty);
                selectedTags.update((ids) =>
                    ids.map((id) => nonNull(tagProperty.parameters()).values[id as unknown as number]),
                );
            }
        }

        this.tasks.set(processedTasks.values().toArray());
    }

    constructor() {
        void this.initialize();
    }

    addTask(parent?: Task) {
        const defaultProperties = new Map(
            this.properties()
                .values()
                .map((descriptor) => [descriptor, signal(this.defaultValue(descriptor.type()))]),
        ) as PropertyMap;

        const name = nonNull(this.nameProperty());
        const children = nonNull(this.childrenProperty());
        const parents = nonNull(this.parentsProperty());

        const task = new Task(Date.now(), defaultProperties, name, children, parents);

        parent?.children.update((tasks) => [...tasks, task]);

        void this.network
            .addTask()
            .then(({ id }) => task.id.set(id))
            .then(() => {
                if (parent) this.updateTask(parent, children);
            });

        this.tasks.push(task);
    }

    updateTask(task: Task, property: Property) {
        const tid = task.id();
        const pid = property.id();
        const id = `${tid}:${pid}`;

        schedule({
            fn: () => void this.network.updateTask({ tasks: [task.serialized()] }),
            id,
        });
    }

    deleteTask(task: Task) {
        this.tasks.remove(task);
        void this.network.deleteTask({ id: task.id() });
    }

    addProperty() {
        const property = new Property({
            id: Date.now(),
            name: "Text property",
            type: "text" as const,
            parameters: undefined,
            icon: this.propertyIcons.text,
        });

        for (const task of this.tasks()) task.properties.set(property, signal(this.defaultValue(property.type())));

        this.properties.setValue(property.id(), property);

        void this.network.addProperty(property.serialized()).then(({ id }) => {
            this.properties.delete(property.id());
            property.id.set(id);
            this.properties.setValue(id, property);
        });
    }
    updateProperty(descriptor: Property) {
        const id = descriptor.id();
        const values = {
            name: descriptor.name(),
            type: descriptor.type(),
            parameters: descriptor.parameters(),
            icon: descriptor.icon(),
        };

        schedule({
            fn: () => void this.network.updateProperty({ id, ...values }),
            id: `property:${id}`,
        });
    }

    deleteProperty(descriptor: Property) {
        for (const task of this.tasks()) task.properties.delete(descriptor);
        this.properties.delete(descriptor.id());
        void this.network.deleteProperty({ id: descriptor.id() });
    }

    defaultFilter() {
        const [property] = this.properties().values();
        return new Filter("New Filter", property, [], "is");
    }

    private defaultValue<T extends PropertyType>(propertyType: T): PropertyValue<T> {
        switch (propertyType) {
            case "text":
                return "" as PropertyValue<T>;
            case "relation":
                return [] as Task[] as PropertyValue<T>;
            case "tag":
                return [] as ITag[] as PropertyValue<T>;
            // case "moment":
            //     return new Date();
            // case "interval":
            //     return {
            //         start: new Date(),
            //         end: new Date(),
            //     };
            default:
                throw new Error(`Unknown property type: ${propertyType}`);
        }
    }
}
