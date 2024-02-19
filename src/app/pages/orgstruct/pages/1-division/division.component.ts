import { Component, Input, inject } from "@angular/core";
import {
    ClickDirective,
    ContextMenuDirective,
    EditableComponent,
    LazyForDirective,
    type IContextMenuOption,
} from "@components";
import type { MetaPlain } from "@utils";
import { CardContentDirective } from "../../cards-manager/card-content.directive";
import { CardsManagerComponent } from "../../cards-manager/cards-manager.component";
import { OfficeComponent } from "../2-office/office.component";
import { DataService, type LinkedArray } from "@services";
import type { Identifier } from "@domain";

@Component({
    selector: "app-division",
    standalone: true,
    imports: [
        OfficeComponent,
        CardContentDirective,
        CardsManagerComponent,
        ClickDirective,
        ContextMenuDirective,
        EditableComponent,
        LazyForDirective,
    ],
    templateUrl: "./division.component.html",
    styleUrl: "./division.component.scss",
})
export class DivisionComponent {
    private readonly data = inject(DataService);

    private _division?: MetaPlain<"division">;
    offices?: LinkedArray<"office">;

    @Input({ required: true }) set division(value: MetaPlain<"division">) {
        this._division = value;
        this.offices = this.data.linkedArray("office", value);
        this.offices.add(...value.offices);
    }

    get division() {
        return this._division!;
    }

    readonly cardsManager = inject(CardsManagerComponent);

    contextOptions(office?: MetaPlain<"office">) {
        const options: IContextMenuOption[] = [
            {
                text: "Add office",
                action: () => this.offices?.linkedAdd(),
            },
        ];
        if (office) {
            options.push({
                text: "Remove office",
                flavor: "danger",
                action: () => this.offices?.linkedRemove(office),
            });
        }
        return options;
    }
}
