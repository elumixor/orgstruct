import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { IContacts, IEstimate, Identifier } from "@domain";
import { yellow } from "@utils";
import { NotionPropertyDescriptor, NotionRelationPropertyDescriptor } from "./property-types";

export function extractProperty<T extends NotionPropertyDescriptor>(
    page: PageObjectResponse,
    descriptor: T,
): MapReturnType<T> {
    type R = MapReturnType<T>;

    if (descriptor.type === "image") {
        if (!page.icon) return null as R;
        if (page.icon.type === "emoji") return page.icon.emoji as R;
        if (page.icon.type === "external") return page.icon.external.url as R;
        return page.icon.file.url as R;
    }

    if (descriptor.type === "estimate") {
        console.log(yellow("Estimate property is not yet supported"));
        return null as R;
    }

    if (descriptor.type === "contacts") {
        console.log(yellow("Contacts property is not yet supported"));
        return null as R;
    }

    const { name, type } = descriptor;
    const { properties } = page;
    const propertyObject = properties[name];

    if (!propertyObject) throw new Error(`Property ${name} not found`);
    if (type !== propertyObject.type)
        throw new Error(`Property ${name} has a wrong type. Actual: ${propertyObject.type}, but requested: ${type}`);

    if (propertyObject.type === "title") return propertyObject.title[0].plain_text as R;
    if (propertyObject.type === "rich_text")
        return propertyObject.rich_text.map((text) => text.plain_text).join(" ") as R;
    if (propertyObject.type === "relation") {
        const results = propertyObject.relation.map(({ id }) => ({ id }));
        if (descriptor.type === "relation" && descriptor.single) return results.first as R;
        else return results as R;
    }
    if (propertyObject.type === "number") return propertyObject.number as R;
    if (propertyObject.type === "select") return propertyObject.select as R;
    if (propertyObject.type === "multi_select") return propertyObject.multi_select as { name: string }[] as R;
    if (propertyObject.type === "date") return propertyObject.date as R;

    throw new Error(`Property ${name} is not yet supported`);
}

export function extractProperties<T extends Record<string, NotionPropertyDescriptor>>(
    result: PageObjectResponse,
    properties: T,
): MapProperties<T> {
    return Object.fromEntries(
        Object.entries(properties).map(([property, descriptor]) => [property, extractProperty(result, descriptor)]),
    ) as MapProperties<T>;
}

export type MapProperties<T extends Record<string, NotionPropertyDescriptor>> = {
    [P in keyof T]: MapReturnType<T[P]>;
};

export interface MapNotionType {
    title: string;
    rich_text: string;
    relation: Identifier | Identifier[];
    number: number;
    select: { name: string } | null;
    multi_select: { name: string }[];
    date: { start: string; end?: string };
    // Special types
    image: string;
    estimate: IEstimate;
    contacts: IContacts;
}

export type MapReturnType<T extends NotionPropertyDescriptor> = T extends NotionRelationPropertyDescriptor
    ? T["single"] extends true
        ? Identifier
        : Identifier[]
    : MapNotionType[T["type"]];
