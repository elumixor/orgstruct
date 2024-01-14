import { Component, Input } from "@angular/core";
import { BlockComponent } from "../../block/block.component";
import { IDivision, IOffice } from "@domain";
import { DBEntry } from "@utils";
import { NetworkService } from "@services";
import { ContextMenuDirective, IContextMenuOption } from "@components";

@Component({
    selector: "app-division",
    standalone: true,
    imports: [BlockComponent, ContextMenuDirective],
    templateUrl: "./division.component.html",
    styleUrl: "./division.component.scss",
})
export class DivisionComponent {
    @Input({ required: true }) division!: DBEntry<IDivision>;

    readonly contextMenuDivision: IContextMenuOption[] = [
        {
            text: "Delete division",
            action: () => this.network.remove(this.division),
        },
    ];

    constructor(protected readonly network: NetworkService) {}

    addOffice() {
        this.network.createDefault("office", { divisionId: this.division.id });
    }

    contextMenuOffice(office: DBEntry<IOffice>): IContextMenuOption[] {
        return [
            {
                text: "Delete office",
                action: () => this.network.remove(office),
            },
        ];
    }

    getOffice(officeId: number) {
        return this.network.data().find(({ id }) => id === officeId) as DBEntry<IOffice>;
    }
}
