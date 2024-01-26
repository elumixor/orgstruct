import { IOffice } from "./office";
import { IBaseInfo } from "./base-info";
import { IProducer } from "./producer";

export interface IDivision extends IBaseInfo, IProducer {
    offices: IOffice[];
}
