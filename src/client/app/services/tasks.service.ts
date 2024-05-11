import { Injectable, computed, inject, signal } from "@angular/core";
import {
    Filter,
    Task,
    type IBoardData,
    type IPropertyDescriptor,
    type IPropertyType,
    type IPropertyValue,
    type ITag,
    type PropertyMap,
} from "@domain";
import { all, nonNull } from "@elumixor/frontils";
import { signalArray, signalMap } from "../utils";
import { NetworkService } from "./network.service";

/**
 * Manages tasks
 */
@Injectable({
    providedIn: "root",
})
export class TasksService {
    readonly propertyTypes = [
        "text",
        "relation",
        "tag",
        // "moment",
        // "interval"
    ] satisfies IPropertyType[];
    readonly propertyIcons = new Map([
        ["text", "pi pi-align-left"],
        ["relation", "pi pi-link"],
        ["tag", "pi pi-tag"],
        // ["moment", "pi pi-calendar"],
        // ["interval", "pi pi-clock"],
    ]) satisfies Map<IPropertyType, string>;
    private readonly network = inject(NetworkService);

    private readonly boardData = signal<IBoardData | undefined>(undefined);
    readonly properties = signalMap<number, IPropertyDescriptor>();
    readonly tasks = signalArray<Task>();

    // Special properties
    readonly nameProperty = computed(() => {
        const namePropertyId = this.boardData()?.nameDescriptorId;
        if (!namePropertyId) return undefined;
        return this.properties.get(namePropertyId) as IPropertyDescriptor<"text">;
    });
    readonly childrenProperty = computed(() => {
        const childrenPropertyId = this.boardData()?.childrenDescriptorId;
        if (!childrenPropertyId) return undefined;
        return (this.properties.get(childrenPropertyId) ?? []) as IPropertyDescriptor<"relation">;
    });
    readonly parentsProperty = computed(() => {
        const parentsPropertyId = this.boardData()?.parentsDescriptorId;
        if (!parentsPropertyId) return undefined;
        return (this.properties.get(parentsPropertyId) ?? []) as IPropertyDescriptor<"relation">;
    });

    // Tasks, organized in a tree structure
    private readonly openMap = new Map<string, boolean>(); // we need to keep track of which tree element is open and preserve it during updates
    readonly taskTree = computed(() => {
        // Start with the top level tasks
        const tasks = this.tasks().filter((task) => task.parents.isEmpty);

        // Alias to keep the "this" context
        const openMap = this.openMap;

        const processTask = (task: Task, parent?: Task): IProcessedTask => {
            const id = `${task.id}:${parent?.id ?? ""}`;

            return {
                data: task,
                get open() {
                    return openMap.get(id) ?? false;
                },
                set open(value) {
                    openMap.set(id, value);
                },
                children: task.children.map((child) => processTask(child, task)),
            };
        };

        return tasks
            .values()
            .map((task) => processTask(task))
            .toArray();
    });

    private async initialize() {
        // Get initial data from the server
        const [tasks, descriptorsRaw, boardData] = await all(
            this.network.getTasks(),
            this.network.getDescriptors(),
            this.network.getBoardData(),
        );

        // Fill the board data
        this.boardData.set(boardData);

        // Fill the property descriptor map
        this.properties.set(new Map(descriptorsRaw.map((d) => [d.id, { ...d, icon: this.propertyIcons.get(d.type) }])));

        const nameProperty = this.nameProperty()!;
        const childrenProperty = this.childrenProperty()!;
        const parentsProperty = this.parentsProperty()!;

        // Create a map id -> Task
        const processedTasks = new Map(
            tasks.map(({ id, properties }) => {
                const values = new Map(
                    this.properties()
                        .entries()
                        .map(([key, descriptor]) => [descriptor, properties[key]]),
                ) as PropertyMap;

                return [id, new Task(id, values, nameProperty, childrenProperty, parentsProperty)];
            }),
        );

        // For all tasks, change relations from id to Task (revive)
        // Also, replace tag indices with actual values
        const tags = this.properties()
            .values()
            .filter((d) => d.type === "tag")
            .map((d) => {
                const descriptor = d as IPropertyDescriptor<"tag">;
                const valueMap = new Map<number, ITag>(
                    Object.entries(descriptor.parameters!.values).map(([k, v]) => [Number(k), v]),
                );
                (d as IPropertyDescriptor<"tag">).parameters!.values = valueMap;

                return d;
            })
            .toArray() as IPropertyDescriptor<"tag">[];

        for (const task of processedTasks.values()) {
            task.children = task.children.map((id) => nonNull(processedTasks.get(id as unknown as number)));
            task.parents = task.parents.map((id) => nonNull(processedTasks.get(id as unknown as number)));

            for (const tagProperty of tags) {
                task.properties.set(
                    tagProperty,
                    (task.properties.get(tagProperty) as unknown as number[]).map(
                        (i) => tagProperty.parameters!.values.get(i)!,
                    ),
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
                .map((descriptor) => [descriptor, this.defaultValue(descriptor.type)]),
        ) as PropertyMap;

        const task = new Task(
            Date.now(),
            defaultProperties,
            this.nameProperty()!,
            this.childrenProperty()!,
            this.parentsProperty()!,
        );

        void this.network.addTask().then(({ id }) => (task.id = id));

        parent?.children.push(task);
        this.tasks.push(task);
    }

    // todo: side-effect
    addProperty() {
        const propertyDescriptor = {
            id: Date.now(),
            name: "Text property",
            type: "text",
        } satisfies IPropertyDescriptor<"text">;

        for (const task of this.tasks())
            task.properties.set(propertyDescriptor, this.defaultValue(propertyDescriptor.type));

        this.properties.setValue(propertyDescriptor.id, propertyDescriptor);
        this.tasks.update((t) => [...t]);
    }

    // todo: side-effect
    deleteProperty(descriptor: IPropertyDescriptor) {
        for (const task of this.tasks()) task.properties.delete(descriptor);

        this.properties.delete(descriptor.id);
        this.tasks.update((t) => [...t]);
    }

    // todo: side-effect
    removeTag(descriptor: IPropertyDescriptor<"tag">, tag: ITag) {
        descriptor.parameters!.values.delete(tag.id);

        this.tasks.update((tasks) => {
            for (const task of tasks) task.properties.get(descriptor).remove(tag);
            return tasks;
        });
    }

    defaultFilter() {
        const [property] = this.properties().values();
        return new Filter("New Filter", property, [], "is");
    }

    private defaultValue<T extends IPropertyType>(propertyType: T): IPropertyValue<T> {
        switch (propertyType) {
            case "text":
                return "";
            case "relation":
                return [];
            case "tag":
                return [];
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

export interface IProcessedTask {
    data: Task;
    open: boolean;
    children: IProcessedTask[];
}
