import { Component, Input, inject } from "@angular/core";
import { RefProvider } from "@utils";
import { CardContentDirective } from "../../cards-manager/card-content.directive";
import { CardsManagerComponent } from "../../cards-manager/cards-manager.component";
import { OfficeComponent } from "../2-office/office.component";

@Component({
    selector: "app-division",
    standalone: true,
    imports: [OfficeComponent, CardContentDirective, CardsManagerComponent],
    templateUrl: "./division.component.html",
    styleUrl: "./division.component.scss",
})
export class DivisionComponent {
    @Input({ required: true }) division!: {
        fullName: string;
        firstLetter: string;
        offices: { name: string }[];
    };

    private readonly cardsManager = inject(CardsManagerComponent, { optional: true });

    showOffice(office: CardContentDirective, blockRef: RefProvider) {
        this.cardsManager?.push(office, { from: blockRef });
    }
}
