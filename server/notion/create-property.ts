import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import { MapNotionType } from "./extract-property";

export function createProperty<T extends keyof MapNotionType>(
    request: SetPropertyRequest<T>,
): CreatePageParameters["properties"][string] {
    type M = MapNotionType;

    if (request.type === "image") throw new Error("Image property is not yet supported");
    if (request.type === "estimate") throw new Error("Estimate property is not yet supported");
    if (request.type === "contacts") throw new Error("Contacts property is not yet supported");

    if (request.type === "title")
        return { type: request.type, title: [{ text: { content: request.value as M["title"] } }] };

    if (request.type === "rich_text")
        return { type: request.type, rich_text: [{ text: { content: request.value as M["rich_text"] } }] };

    if (request.type === "relation") {
        const relation = request.value as M["relation"];
        const relations = Array.isArray(relation) ? relation : [relation];
        return { type: request.type, relation: relations };
    }

    if (request.type === "number") return { type: request.type, number: request.value as M["number"] };

    if (request.type === "select") return { type: request.type, select: request.value as M["select"] };

    if (request.type === "multi_select")
        return { type: request.type, multi_select: (request.value as M["multi_select"]).map((name) => name) };

    if (request.type === "date") return { type: request.type, date: request.value as M["date"] };

    throw new Error(`Property ${request.type as string} is not yet supported`);
}

export function createProperties<T extends SetPropertyRequest[]>(properties: T) {
    return Object.fromEntries(
        properties.map((property) => [property.name, createProperty(property)]),
    ) as CreatePageParameters["properties"];
}

export interface SetPropertyRequest<T extends keyof MapNotionType = keyof MapNotionType> {
    name: string;
    type: T;
    value: MapNotionType[T];
}
