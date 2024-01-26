import { IBaseInfo } from "./base-info";
import { IDivision } from "./division";
import { IBranch } from "./branch";
import { IProducer } from "./producer";

export interface IOffice extends IBaseInfo, IProducer {
    division: IDivision;
    branches: IBranch[];
}
