import { IBaseInfo } from "./base-info";
import { IDivision } from "./division";
import { IBranch } from "./branch";

export interface IOffice extends IBaseInfo {
    product: string;
    division: IDivision;
    branches: IBranch[];
}
