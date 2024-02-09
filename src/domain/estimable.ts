import { TimeUnit } from "./time-unit";
import { IEstimate } from "./estimate";

export interface IEstimable {
    estimate?: { range: IEstimate; unit: TimeUnit };
}
