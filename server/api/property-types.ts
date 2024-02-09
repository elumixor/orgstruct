import { ItemKey, ItemObject, ItemType, ItemValue } from "@domain";
import { Refs2Id } from "@utils";
import { NotionPropertyDescriptor, SetPropertyRequest } from "../notion";

type NotionDatabaseDescriptor<T extends ItemType> = {
    [P in keyof Required<ItemObject<T>>]: NotionPropertyDescriptor;
};

const baseProperties = {
    title: { name: "Title", type: "title" },
    description: { name: "Description", type: "rich_text" },
    product: { name: "Product", type: "rich_text" },
    imageUrl: { type: "image" },
} as const;

export const notionDatabaseDescriptors: {
    [K in ItemType]: NotionDatabaseDescriptor<K>;
} = {
    division: {
        ...baseProperties,
        offices: { name: "Offices", type: "relation" },
    },
    office: {
        ...baseProperties,
        branches: { name: "Branches", type: "relation" },
        division: { name: "Division", type: "relation", single: true },
    },
    branch: {
        ...baseProperties,
        office: { name: "Office", type: "relation", single: true },
        tasks: { name: "Tasks", type: "relation" },
        processes: { name: "Processes", type: "relation" },
    },

    task: {
        ...baseProperties,
        branch: { name: "Branch", type: "relation", single: true },
        process: { name: "Process", type: "relation", single: true },
        assignee: { name: "Assignee", type: "relation", single: true },
        supertask: { name: "Super-task", type: "relation", single: true },
        subtasks: { name: "Sub-tasks", type: "relation" },
        requiredBy: { name: "Required by", type: "relation" },
        requirements: { name: "Requirements", type: "relation" },
        estimate: { type: "estimate" },
    },
    process: {
        ...baseProperties,
        branch: { name: "Branch", type: "relation", single: true },
        assignee: { name: "Assignee", type: "relation", single: true },
        tasks: { name: "Tasks", type: "relation" },
    },

    person: {
        name: { name: "Name", type: "title" },
        position: { name: "Position", type: "relation", single: true },
        contacts: { type: "contacts" },
    },
    position: {
        ...baseProperties,
        tasks: { name: "Tasks", type: "relation" },
        processes: { name: "Processes", type: "relation" },
        subordinates: { name: "Subordinates", type: "relation" },
        supervisor: { name: "Supervisor", type: "relation", single: true },
        person: { name: "Person", type: "relation", single: true },
    },
};

export const itemsProperties = Object.fromEntries(
    Object.entries(notionDatabaseDescriptors).map(([itemType, properties]) => [itemType, Object.keys(properties)]),
) as unknown as {
    [K in ItemType]: ItemKey<K>[];
};

export function propertyToNotion<T extends ItemType>(itemType: T, propertyName: ItemKey<T>, value?: ItemValue<T>) {
    const descriptors = notionDatabaseDescriptors[itemType];
    const descriptor = descriptors[propertyName];

    if (descriptor.type === "image") throw new Error("Image property is not yet supported");
    if (descriptor.type === "estimate") throw new Error("Image property is not yet supported");
    if (descriptor.type === "contacts") throw new Error("Image property is not yet supported");
    if (!descriptor) throw new Error(`Property ${String(propertyName)} not found`);

    return {
        name: descriptor.name,
        type: descriptor.type,
        value,
    } as SetPropertyRequest;
}

export function propertiesToNotion<T extends ItemType>(itemType: T, properties: Partial<Refs2Id<ItemObject<T>>>) {
    return Object.entries(properties).map(([propertyName, value]) =>
        propertyToNotion(itemType, propertyName, value as ItemValue<T>),
    );
}
