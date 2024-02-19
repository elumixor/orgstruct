import type { IBaseInfo } from "./base-info";
import type { IBranch } from "./branch";
import type { IPosition } from "./position";
import type { IProducer } from "./producer";
import type { ITask } from "./task";

export interface IProcess extends IBaseInfo, IProducer {
    branch?: IBranch;
    tasks?: ITask[];
    assignee?: IPosition;
}
