import { Injectable } from "@angular/core";
import type { IProcess } from "@domain";
import { locallyStored, signalArray } from "@utils";

@Injectable({
    providedIn: "root",
})
export class ProcessesService {
    readonly processes = locallyStored("processes", signalArray<IProcess>());
}
