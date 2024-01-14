import { Public } from "../utils";

export type IEstimate = Public<Estimate>;

export class Estimate {
    constructor(readonly min: number, readonly max = min, readonly avg = (min + max) / 2) {}
}
