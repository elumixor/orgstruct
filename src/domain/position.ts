import { IBaseInfo } from "./base-info";
import { IDivision } from "./division";
import { IPerson } from "./person";
import { ITask } from "./task";

export interface IPosition extends IBaseInfo {
    department?: IDivision; // for owner and CEO - they don't have a department
    tasks?: ITask[];
    assignee?: IPerson;
    subordinates?: IPosition[];
    supervisor?: IPosition;
}
