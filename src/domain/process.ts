import type { IBaseInfo } from "./base-info";
import type { Identifier } from "./identifier";

export interface IProcess extends IBaseInfo {
    dependencies: string[]; // also "inputs"
    outputs: { outcome: string; product: string }[];
    events: { title: string; description?: string; product: string }[];
    responsibility: Responsibility;
    stage: number;
    subtasks: IProcess[];
}

type Responsibility =
    | "unassigned"
    | "owner"
    | "ceo"
    | { type: "division" | "office" | "branch" | "position"; id: Identifier }; // todo: Generalize "owner", "ceo"...
