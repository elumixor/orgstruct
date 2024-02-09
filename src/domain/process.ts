import { IBaseInfo } from "./base-info";
import { IBranch } from "./branch";
import { IPosition } from "./position";
import { IProducer } from "./producer";
import { ITask } from "./task";

export interface IProcess extends IBaseInfo, IProducer {
    branch?: IBranch;
    tasks?: ITask[];
    assignee?: IPosition;
}
