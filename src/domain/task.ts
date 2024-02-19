import type { IAssignable } from "./assignable";
import type { IBaseInfo } from "./base-info";
import type { IBranch } from "./branch";
import type { IEstimable } from "./estimable";
import type { IProcess } from "./process";
import type { IProducer } from "./producer";

export interface ITask extends IBaseInfo, IProducer, IAssignable, IEstimable {
    branch: IBranch;
    process?: IProcess;
    supertask?: ITask;
    subtasks?: ITask[];
    requirements?: ITask[];
    requiredBy?: ITask[];
}
