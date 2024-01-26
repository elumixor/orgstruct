import { Component, Input } from "@angular/core";
import { ContextMenuDirective, EditableComponent, IContextMenuOption } from "@components";
import { IBranch } from "@domain";
import { NetworkService } from "@services";
import { DBEntry } from "@utils";
import { BlockComponent } from "../../block/block.component";
import { FVPComponent } from "../fvp/fvp.component";

@Component({
    selector: "app-branch",
    standalone: true,
    imports: [BlockComponent, ContextMenuDirective, FVPComponent, EditableComponent],
    templateUrl: "./branch.component.html",
    styleUrl: "./branch.component.scss",
})
export class BranchComponent {
    @Input({ required: true }) branch!: DBEntry<IBranch>;

    readonly contextMenu: IContextMenuOption[] = [
        {
            text: "Remove branch",
            action: () => this.network.remove(this.branch),
        },
        {
            text: "Add task",
            action: () => this.network.create("task", { branchId: this.branch.id }),
        },
    ];

    constructor(protected readonly network: NetworkService) {}

    get title() {
        return this.branch.title;
    }

    set title(value) {
        this.branch.title = value;
        this.network.update(this.branch, { title: value });
    }

    get description() {
        return this.branch.description;
    }

    set description(value) {
        this.branch.description = value;
        this.network.update(this.branch, { description: value });
    }

    get product() {
        return this.branch.product;
    }

    set product(value) {
        console.log("Set product?");
        this.branch.product = value;
        this.network.update(this.branch, { product: value });
    }
}
