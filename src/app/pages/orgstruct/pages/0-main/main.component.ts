import { Component, inject } from "@angular/core";
import {
    ClickDirective,
    ContextMenuDirective,
    EditableComponent,
    LazyForDirective,
    type IContextMenuOption,
} from "@components";
import { DataService } from "@services";
import type { MetaPlain } from "@utils";
import { CardContentDirective } from "../../cards-manager/card-content.directive";
import { CardsManagerComponent } from "../../cards-manager/cards-manager.component";
import { ConnectableDirective } from "../../connector/connectable.directive";
import { ConnectorComponent } from "../../connector/connector.component";
import { DivisionComponent } from "../1-division/division.component";

@Component({
    selector: "app-main",
    standalone: true,
    imports: [
        ConnectorComponent,
        ConnectableDirective,
        CardContentDirective,
        DivisionComponent,
        ContextMenuDirective,
        ClickDirective,
        EditableComponent,
        LazyForDirective,
    ],
    templateUrl: "./main.component.html",
    styleUrl: "./main.component.scss",
})
export class MainComponent {
    readonly data = inject(DataService);
    readonly cardsManager = inject(CardsManagerComponent);

    companyName = "Ishta Gaming";
    description = "We free";

    contextOptions(division?: MetaPlain<"division">) {
        const options: IContextMenuOption[] = [
            {
                text: "Add division",
                action: () => this.data.divisionIds.linkedAdd(),
            },
        ];

        if (division) {
            options.push({
                text: "Remove division",
                flavor: "danger",
                action: () => this.data.divisionIds.linkedRemove(division),
            });
        }

        return options;
    }
}
