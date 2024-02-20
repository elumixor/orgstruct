import { Component, inject } from "@angular/core";
import {
    ClickDirective,
    ContextMenuDirective,
    EditableComponent,
    LazyForDirective,
    type IContextMenuOption,
} from "@components";
import { DataService, NetworkService, type Lazy } from "@services";
import { CardContentDirective, CardsManagerComponent } from "../../cards-manager";
import { ConnectableDirective, ConnectorComponent } from "../../connector";
import { DivisionComponent } from "../1-division/division.component";
import { newDivision } from "@domain";

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
    private readonly network = inject(NetworkService);
    private readonly data = inject(DataService);
    readonly cardsManager = inject(CardsManagerComponent);

    readonly divisions = this.data.arrayOfLazy("division");

    constructor() {
        void this.network
            .pages("division", { properties: [] })
            .then((divisionIds) => this.divisions.set(this.data.lazifyIds("division", divisionIds)));
    }

    companyName = "Ishta Gaming";
    description = "We free";

    contextOptions(division?: Lazy<"division">) {
        const options: IContextMenuOption[] = [
            {
                text: "Add division",
                action: () => this.divisions.add(this.data.lazifyFrom("division", newDivision())),
            },
        ];

        if (division) {
            options.push({
                text: "Remove division",
                flavor: "danger",
                action: () => this.divisions.remove(division),
            });
        }

        return options;
    }
}
