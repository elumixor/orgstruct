import { Component, inject } from "@angular/core";
import { ProxifierService } from "@services";
import { LazyComponent, LazyTargetDirective } from "@components";
import { DivisionComponent } from "./division/division.component";

@Component({
    selector: "app-divisions",
    standalone: true,
    imports: [DivisionComponent, LazyComponent, LazyTargetDirective],
    templateUrl: "./divisions.component.html",
    styleUrl: "./divisions.component.scss",
})
export class DivisionsComponent {
    readonly divisions = inject(ProxifierService).lazyCollection("division", {
        initialValue: { title: "New Division", description: "", product: "", offices: [] },
    });
}
