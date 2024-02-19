import type { Entity, EntityName } from "@domain";
import type { NotionProperty } from "./notion-properties";

type NotionEntities<T extends EntityName> = {
    [P in keyof Required<Entity<T>>]: NotionProperty;
};

const baseProperties = {
    title: { name: "Title", type: "title" },
    description: { name: "Description", type: "rich_text" },
    product: { name: "Product", type: "rich_text" },
    imageUrl: { type: "image" },
} as const;

export const notionPropertiesMap: {
    [K in EntityName]: NotionEntities<K>;
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
export type NotionProperties = typeof notionPropertiesMap;

export function notionProperty<T extends EntityName, K extends keyof Entity<T>>(
    entityName: T,
    propertyName: K,
): NotionProperties[T][K] {
    const properties = notionPropertiesMap[entityName];
    const property = properties[propertyName];

    if (property.type === "image") throw new Error("Image property is not yet supported");
    if (property.type === "estimate") throw new Error("Image property is not yet supported");
    if (property.type === "contacts") throw new Error("Image property is not yet supported");

    return property;
}

export function notionProperties<T extends EntityName, U extends Partial<Record<keyof Entity<T>, unknown>>>(
    entityName: T,
    properties: U,
) {
    return Object.entries(properties).map(([propertyName, value]) => {
        const property = notionProperty(entityName, propertyName as keyof Entity<T>);
        return {
            ...property,
            value,
        };
    });
}
