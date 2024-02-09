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
import { FVPComponent } from "../fvp/fvp.component";
import { OfficeComponent } from "../office/office.component";

@Component({
    selector: "app-division",
    standalone: true,
    imports: [
        BlockComponent,
        OfficeComponent,
        ContextMenuDirective,
        FVPComponent,
        EditableComponent,
        LazyComponent,
        LazyTargetDirective,
    ],
    templateUrl: "./division.component.html",
    styleUrl: "./division.component.scss",
    animations: [],
})
export class DivisionComponent {
    @Output() readonly removed = new EventEmitter();

    readonly contextMenuDivision: IContextMenuOption[] = [
        {
            text: "Delete division",
            action: () => this.removed.emit(),
        },
        {
            text: "Add office",
            action: () => this.offices.add(),
        },
    ];

    private _division?: DBEntry<"division">;
    private _offices?: LazyCollection<"office">;

    private readonly proxy = inject(ProxifierService);

    @Input({ required: true }) set division(value: DBEntry<"division">) {
        this._division = value;
        this._offices = this.proxy.lazyCollection("office", {
            ids: value.offices,
            initialValue: { division: value, title: "New office", description: "", product: "", branches: [] },
        });
    }

    get division() {
        return this._division!;
    }

    get offices() {
        return this._offices!;
    }
}
