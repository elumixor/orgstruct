import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import {
    ContextMenuDirective,
    EditableComponent,
    IContextMenuOption,
    LazyTargetDirective,
    LazyComponent,
} from "@components";
import { LazyCollection, ProxifierService } from "@services";
import { DBEntry } from "@utils";
import { BlockComponent } from "../../block/block.component";
import { BranchComponent } from "../branch/branch.component";
import { FVPComponent } from "../fvp/fvp.component";

@Component({
    selector: "app-office",
    standalone: true,
    imports: [
        BlockComponent,
        ContextMenuDirective,
        BranchComponent,
        FVPComponent,
        EditableComponent,
        LazyComponent,
        LazyTargetDirective,
    ],
    templateUrl: "./office.component.html",
    styleUrl: "./office.component.scss",
})
export class OfficeComponent {
    @Output() readonly removed = new EventEmitter();

    readonly contextMenu: IContextMenuOption[] = [
        {
            text: "Remove office",
            action: () => this.removed.emit(),
        },
        {
            text: "Add branch",
            action: () => this.branches.add(),
        },
    ];

    private readonly proxy = inject(ProxifierService);

    private _office?: DBEntry<"office">;
    private _branches?: LazyCollection<"branch">;

    @Input({ required: true }) set office(value: DBEntry<"office">) {
        this._office = value;
        this._branches = this.proxy.lazyCollection("branch", {
            ids: value.branches,
            initialValue: {
                office: value,
                title: "New branch",
                description: "",
                product: "",
                tasks: [],
                processes: [],
            },
        });
    }

    get office() {
        return this._office!;
    }

    get branches() {
        return this._branches!;
    }
}
