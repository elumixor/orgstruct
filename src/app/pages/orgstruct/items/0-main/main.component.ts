import { Component, inject } from "@angular/core";
import { RefProvider } from "@utils";
import { DivisionsService } from "@services";
import { CardContentDirective } from "../../cards-manager/card-content.directive";
import { CardsManagerComponent } from "../../cards-manager/cards-manager.component";
import { DivisionComponent } from "../1-division/division.component";
import { ConnectorComponent } from "./connector/connector.component";
import { ConnectableDirective } from "./connector/connectable.directive";

@Component({
    selector: "app-main",
    standalone: true,
    imports: [ConnectorComponent, ConnectableDirective, CardContentDirective, DivisionComponent],
    templateUrl: "./main.component.html",
    styleUrl: "./main.component.scss",
})
export class MainComponent {
    private readonly cardsManager = inject(CardsManagerComponent, { optional: true });
    private readonly divisionsService = inject(DivisionsService);

    get companyName() {
        return this.divisionsService.companyName;
    }

    get divisions() {
        return this.divisionsService.divisions;
    }

    showDivision(division: CardContentDirective, blockRef: RefProvider) {
        this.cardsManager?.push(division, { from: blockRef });
    }
}
