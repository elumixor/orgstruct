import { Component, Input } from "@angular/core";
import { ContextMenuDirective, EditableComponent, IContextMenuOption } from "@components";
import { IOffice } from "@domain";
import { NetworkService } from "@services";
import { DBEntry } from "@utils";
import { BlockComponent } from "../../block/block.component";
import { BranchComponent } from "../branch/branch.component";
import { FVPComponent } from "../fvp/fvp.component";

@Component({
    selector: "app-office",
    standalone: true,
    imports: [BlockComponent, ContextMenuDirective, BranchComponent, FVPComponent, EditableComponent],
    templateUrl: "./office.component.html",
    styleUrl: "./office.component.scss",
})
export class OfficeComponent {
    @Input({ required: true }) office!: DBEntry<IOffice>;

    readonly contextMenu: IContextMenuOption[] = [
        {
            text: "Remove office",
            action: () => this.network.remove(this.office),
        },
        {
            text: "Add branch",
            action: () => this.network.create("branch", { officeId: this.office.id }),
        },
    ];

    constructor(readonly network: NetworkService) {}

    get title() {
        return this.office.title;
    }

    set title(value) {
        this.office.title = value;
        this.network.update(this.office, { title: value });
    }

    get product() {
        return this.office.product;
    }

    set product(value) {
        this.office.product = value;
        this.network.update(this.office, { product: value });
    }
}
