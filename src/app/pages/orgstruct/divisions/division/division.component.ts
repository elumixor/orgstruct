import { Component, Input } from "@angular/core";
import { IDivision } from "@domain";
import { DBEntry } from "@utils";
import { NetworkService } from "@services";
import { ContextMenuDirective, EditableComponent, IContextMenuOption } from "@components";
import { BlockComponent } from "../../block/block.component";
import { OfficeComponent } from "../office/office.component";
import { FVPComponent } from "../fvp/fvp.component";

@Component({
    selector: "app-division",
    standalone: true,
    imports: [BlockComponent, OfficeComponent, ContextMenuDirective, FVPComponent, EditableComponent],
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
        {
            text: "Add office",
            action: () => this.addOffice(),
        },
    ];

    constructor(protected readonly network: NetworkService) {}

    get title() {
        return this.division.title;
    }

    set title(value) {
        this.division.title = value;
        this.network.update(this.division, { title: value });
    }

    get product() {
        return this.division.product;
    }

    set product(value) {
        this.division.product = value;
        this.network.update(this.division, { product: value });
    }

    addOffice() {
        this.network.create("office", { divisionId: this.division.id });
    }

    getOffice(officeId: number) {
        return this.network.get<"office">(officeId);
    }
}
