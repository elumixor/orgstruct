import { IBranch } from "./branch";
import { IDivision } from "./division";
import { IOffice } from "./office";
import { IPerson } from "./person";
import { IPosition } from "./position";
import { IProcess } from "./process";
import { ITask } from "./task";

export interface ItemObjects {
    division: [IDivision, "Divisions"];
    office: [IOffice, "Offices"];
    branch: [IBranch, "Branches"];

    task: [ITask, "Tasks"];
    process: [IProcess, "Processes"];

    person: [IPerson, "People"];
    position: [IPosition, "Positions"];
}

export type ItemType = keyof ItemObjects;

export type DatabaseName<T extends ItemType = ItemType> = ItemObjects[T][1];
export const databaseNames: Record<ItemType, DatabaseName> = {
    division: "Divisions",
    office: "Offices",
    branch: "Branches",
    task: "Tasks",
    process: "Processes",
    person: "People",
    position: "Positions",
};

export type ItemObject<T extends ItemType = ItemType> = ItemObjects[T][0];
export type ItemKey<T extends ItemType = ItemType> = keyof ItemObject<T>;
export type ItemValue<T extends ItemType = ItemType, K extends ItemKey<T> = ItemKey<T>> = ItemObject<T>[K];

export type GetItemType<T> = T extends ItemObject<infer U> ? U : never;
