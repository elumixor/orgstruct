import { Component, Input } from "@angular/core";
import { ClickDirective, ContextMenuDirective, EditableComponent } from "@components";
import { CardContentDirective } from "../../cards-manager/card-content.directive";
import type { MetaPlain } from "@utils";
// import { BranchComponent } from "../3-branch/branch.component";

@Component({
    selector: "app-office",
    standalone: true,
    imports: [ContextMenuDirective, CardContentDirective, ClickDirective, EditableComponent],
    templateUrl: "./office.component.html",
    styleUrl: "./office.component.scss",
})
export class OfficeComponent {
    // private readonly cardsManager = inject(CardsManagerComponent);
    // private readonly proxy = inject(DataService);
    // private _office?: MetaPlain<"office">;
    // branches?: LazyCollection<"branch">;
    @Input({ required: true }) office!: MetaPlain<"office">;

    //     this._office = value;
    //     this.branches = this.proxy.lazyArray("branch", {
    //         initializer: {
    //             office: { id: value.id },
    //             tasks: [],
    //             title: "New branch",
    //             description: "Description of the branch",
    //             product: "Final Valuable Product that the branch produces",
    //         },
    //     });
    // }
    // get office() {
    //     return this._office!;
    // }
    // contextOptions(branch?: MetaPlain<"branch">) {
    //     const options: IContextMenuOption[] = [
    //         {
    //             text: "Add branch",
    //             action: () => this.branches?.add(),
    //         },
    //     ];
    //     if (branch) {
    //         options.push({
    //             text: "Remove branch",
    //             flavor: "danger",
    //             action: () => this.branches?.remove(branch),
    //         });
    //     }
    //     return options;
    // }
    // showBranch(office: CardContentDirective, blockRef: RefProvider) {
    //     this.cardsManager.push(office, { from: blockRef });
    // }
}
