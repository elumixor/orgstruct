import { IOffice } from "./office";
import { IBaseInfo } from "./base-info";
import { ITask } from "./task";
import { IProducer } from "./producer";
import { IProcess } from "./process";

export interface IBranch extends IBaseInfo, IProducer {
    office: IOffice;
    processes: IProcess[];
    tasks: ITask[];
}
