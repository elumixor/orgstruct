import { notImplemented } from "@utils";
import type { Identifier } from "./identifier";
import type { Plain } from "./plain";
import type { EntityName } from "./entity-names-map";
import type { IProcess } from "./process";

export function newDivision(): Plain<"division"> {
    return {
        title: "New division",
        description: "Description of the division",
        product: "Final Valuable Product that the division produces",
        offices: [],
    };
}

export function newOffice(division: Identifier): Plain<"office"> {
    return {
        title: "New office",
        description: "Description of the office",
        product: "Final Valuable Product that the office produces",
        division,
        branches: [],
    };
}

export function newBranch(office: Identifier): Plain<"branch"> {
    return {
        title: "New branch",
        description: "Description of the branch",
        product: "Final Valuable Product that the branch produces",
        office,
        tasks: [],
    };
}

export function newTask(branch: Identifier): Plain<"task"> {
    return {
        title: "New task",
        description: "Description of the task",
        product: "Final Valuable Product that the task produces",
        branch,
    };
}

export function newProcess(): IProcess {
    return {
        title: "New process",
        description: "Description of the process",
        outputs: [],
        events: [],
        dependencies: [],
        responsibility: "unassigned",
        stage: 0,
        subtasks: [],
    };
}

export const creatorFns = {
    division: newDivision,
    office: newOffice,
    branch: newBranch,
    task: newTask,
    get process() {
        return notImplemented();
    },
    get person() {
        return notImplemented();
    },
    get position() {
        return notImplemented();
    },
} satisfies { [K in EntityName]: (...args: Identifier[]) => Plain<K> };
