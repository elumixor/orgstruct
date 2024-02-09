export type NotionPropertyType = "title" | "rich_text" | "relation" | "number" | "select" | "multi_select" | "date";

export interface NotionProperPropertyDescriptor {
    name: string;
    type: Exclude<NotionPropertyType, "relation">;
}

export interface NotionRelationPropertyDescriptor {
    name: string;
    type: "relation";
    single?: boolean;
}

export type NotionSpecialPropertyDescriptor =
    | {
          type: "image";
      }
    | {
          type: "estimate";
      }
    | {
          type: "contacts";
      };

export type NotionPropertyDescriptor =
    | NotionProperPropertyDescriptor
    | NotionSpecialPropertyDescriptor
    | NotionRelationPropertyDescriptor;
