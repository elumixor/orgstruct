import { IBaseInfo } from "./base-info";
import { IBranch } from "./branch";
import { IDivision } from "./division";
import { IOffice } from "./office";
import { IPerson } from "./person";
import { IPosition } from "./position";
import { ITask } from "./task";

export type ItemType = "task" | "person" | "position" | "other" | "division" | "office" | "branch";

export const itemsPlural: Record<ItemType, string> = {
    task: "tasks",
    person: "people",
    position: "positions",
    other: "other",
    division: "divisions",
    office: "offices",
    branch: "branches",
};

export type ItemObject<T extends ItemType = ItemType> = T extends "task"
    ? ITask
    : T extends "person"
    ? IPerson
    : T extends "position"
    ? IPosition
    : T extends "division"
    ? IDivision
    : T extends "office"
    ? IOffice
    : T extends "branch"
    ? IBranch
    : IBaseInfo;
