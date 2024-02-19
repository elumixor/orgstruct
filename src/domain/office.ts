import type { IBaseInfo } from "./base-info";
import type { IDivision } from "./division";
import type { IBranch } from "./branch";
import type { IProducer } from "./producer";

export interface IOffice extends IBaseInfo, IProducer {
    division: IDivision;
    branches: IBranch[];
}
