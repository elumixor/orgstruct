import type { IOffice } from "./office";
import type { IBaseInfo } from "./base-info";
import type { ITask } from "./task";
import type { IProducer } from "./producer";

export interface IBranch extends IBaseInfo, IProducer {
    office: IOffice;
    tasks: ITask[];
}
