import { IBaseInfo } from "./base-info";
import { IEstimate } from "./estimate";
import { IPosition } from "./position";

export interface ITask extends IBaseInfo {
    assignee?: IPosition;
    hours?: IEstimate;
    supertask?: ITask;
    subtasks?: ITask[];
    requirements?: ITask[];
}
