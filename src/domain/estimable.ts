import type { TimeUnit } from "./time-unit";
import type { IEstimate } from "./estimate";

export interface IEstimable {
    estimate?: { range: IEstimate; unit: TimeUnit };
}
