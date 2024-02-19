export type NotionPropertyType = "title" | "rich_text" | "relation" | "number" | "select" | "multi_select" | "date";

export interface NotionProperProperty {
    name: string;
    type: Exclude<NotionPropertyType, "relation">;
}

export interface NotionRelationProperty {
    name: string;
    type: "relation";
    single?: boolean;
}

export type NotionSpecialProperty =
    | {
          type: "image";
      }
    | {
          type: "estimate";
      }
    | {
          type: "contacts";
      };

export type NotionProperty = NotionProperProperty | NotionSpecialProperty | NotionRelationProperty;
