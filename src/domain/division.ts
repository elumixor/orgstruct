import type { IOffice } from "./office";
import type { IBaseInfo } from "./base-info";
import type { IProducer } from "./producer";

export interface IDivision extends IBaseInfo, IProducer {
    offices: IOffice[];
}
