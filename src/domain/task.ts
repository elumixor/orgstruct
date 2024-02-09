import { IAssignable } from "./assignable";
import { IBaseInfo } from "./base-info";
import { IBranch } from "./branch";
import { IEstimable } from "./estimable";
import { IProcess } from "./process";
import { IProducer } from "./producer";

export interface ITask extends IBaseInfo, IProducer, IAssignable, IEstimable {
    branch?: IBranch;
    process?: IProcess;
    supertask?: ITask;
    subtasks?: ITask[];
    requirements?: ITask[];
    requiredBy?: ITask[];
}
