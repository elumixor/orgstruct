import { IOffice } from "./office";
import { IBaseInfo } from "./base-info";
import { ITask } from "./task";
import { IProducer } from "./producer";

export interface IBranch extends IBaseInfo, IProducer {
    office: IOffice;
    tasks: ITask[];
}
