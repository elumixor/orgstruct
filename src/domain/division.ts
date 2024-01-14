import { IOffice } from "./office";
import { IBaseInfo } from "./base-info";

export interface IDivision extends IBaseInfo {
    product: string;
    offices: IOffice[];
}
