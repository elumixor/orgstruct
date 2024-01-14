import { IOffice } from "./office";
import { IBaseInfo } from "./base-info";
import { ITask } from "./task";

export interface IBranch extends IBaseInfo {
    product: string;
    office: IOffice;
    tasks: ITask[];
}
