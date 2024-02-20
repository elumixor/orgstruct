import { Component, Input, inject } from "@angular/core";
import {
    ClickDirective,
    ContextMenuDirective,
    EditableComponent,
    LazyForDirective,
    type IContextMenuOption,
} from "@components";
import { newOffice, type MetaPlain } from "@domain";
import { DataService, syncArrays, type Lazy } from "@services";
import { CardContentDirective } from "../../cards-manager/card-content.directive";
import { CardsManagerComponent } from "../../cards-manager/cards-manager.component";
import { OfficeComponent } from "../2-office/office.component";

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
    readonly cardsManager = inject(CardsManagerComponent);
    private readonly data = inject(DataService);

    readonly offices = this.data.arrayOfLazy("office");

    private _division!: MetaPlain<"division">;

    constructor() {
        syncArrays(this.offices, () => this._division.offices);
    }

    @Input({ required: true }) set division(value: MetaPlain<"division">) {
        this._division = value;
        this.offices.set(this.data.lazifyIds("office", value.offices));
    }

    get division() {
        return this._division;
    }

    contextOptions(office?: Lazy<"office">) {
        const options: IContextMenuOption[] = [
            {
                text: "Add office",
                action: () => this.offices.add(this.data.lazifyFrom("office", newOffice(this.division))),
            },
        ];
        if (office) {
            options.push({
                text: "Remove office",
                flavor: "danger",
                action: () => this.offices.remove(office),
            });
        }
        return options;
    }
}
