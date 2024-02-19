import type { IBranch } from "./branch";
import type { IDivision } from "./division";
import type { IOffice } from "./office";
import type { IPerson } from "./person";
import type { IPosition } from "./position";
import type { IProcess } from "./process";
import type { ITask } from "./task";

// Defines the mapping between:
// internal entity name -> internal entity type
interface EntityNameTypeMap {
    division: IDivision;
    office: IOffice;
    branch: IBranch;
    task: ITask;
    process: IProcess;
    person: IPerson;
    position: IPosition;
}

// Maps internal database item names to Notion database names (we need to have a javascript object)
export const entityName2NotionName = {
    division: "Divisions",
    office: "Offices",
    branch: "Branches",
    task: "Tasks",
    process: "Processes",
    person: "People",
    position: "Positions",
} as const;
type EntityName2NotionName = typeof entityName2NotionName;

// Internal database item names
export type EntityName = keyof EntityNameTypeMap;

// Notion database names
export type NotionName<T extends EntityName = EntityName> = EntityName2NotionName[T];

// Internal database item type for the given item
export type Entity<T extends EntityName = EntityName> = EntityNameTypeMap[T];
