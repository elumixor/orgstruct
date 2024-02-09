import { IBaseInfo } from "./base-info";
import { IPerson } from "./person";
import { IProcess } from "./process";
import { ITask } from "./task";

export interface IPosition extends IBaseInfo {
    tasks?: ITask[];
    processes?: IProcess[];
    subordinates?: IPosition[];
    supervisor?: IPosition;
    person?: IPerson;
}
