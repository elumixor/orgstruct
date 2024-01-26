import { Component, computed } from "@angular/core";
import { NetworkService } from "@services";
import { DBEntry } from "@utils";
import { IDivision } from "@domain";
import { DivisionComponent } from "./division/division.component";

@Component({
    selector: "app-divisions",
    standalone: true,
    imports: [DivisionComponent],
    templateUrl: "./divisions.component.html",
    styleUrl: "./divisions.component.scss",
})
export class DivisionsComponent {
    readonly divisions;

    constructor(protected readonly network: NetworkService) {
        this.divisions = computed(() => {
            const data = this.network.data();
            return data.filter((item) => item.type === "division") as DBEntry<IDivision>[];
        });
    }
}
