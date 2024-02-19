import type { IBaseInfo } from "./base-info";
import type { IPerson } from "./person";
import type { IProcess } from "./process";
import type { ITask } from "./task";

export interface IPosition extends IBaseInfo {
    tasks?: ITask[];
    processes?: IProcess[];
    subordinates?: IPosition[];
    supervisor?: IPosition;
    person?: IPerson;
}
