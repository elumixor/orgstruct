import { Component, Input, inject } from "@angular/core";
import { ClickDirective, EditableComponent, LazyForDirective, type IContextMenuOption } from "@components";
import { newBranch, type MetaPlain } from "@domain";
import { DataService, type Lazy } from "@services";
import { CardContentDirective, CardsManagerComponent } from "../../cards-manager";
import { BranchComponent } from "../3-branch/branch.component";

@Component({
    selector: "app-office",
    standalone: true,
    imports: [CardContentDirective, ClickDirective, EditableComponent, BranchComponent, LazyForDirective],
    templateUrl: "./office.component.html",
    styleUrl: "./office.component.scss",
})
export class OfficeComponent {
    readonly cardsManager = inject(CardsManagerComponent);
    private readonly proxy = inject(DataService);
    private _office!: MetaPlain<"office">;
    readonly branches = this.proxy.arrayOfLazy("branch");

    @Input({ required: true }) set office(value: MetaPlain<"office">) {
        this._office = value;
        this.branches.set(this.proxy.lazifyIds("branch", value.branches));
    }

    get office() {
        return this._office;
    }

    contextOptions(branch?: Lazy<"branch">) {
        const options: IContextMenuOption[] = [
            {
                title: "Add branch",
                action: () => this.branches.add(this.proxy.lazifyFrom("branch", newBranch(this.office))),
            },
        ];
        if (branch) {
            options.push({
                title: "Remove branch",
                flavor: "danger",
                action: () => this.branches.remove(branch),
            });
        }
        return options;
    }
}
