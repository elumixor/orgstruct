import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
    ContextMenuDirective,
    EditableComponent,
    IContextMenuOption,
    LazyTargetDirective,
    LazyComponent,
} from "@components";
import { LazyCollection, ProxifierService } from "@services";
import { DBEntry } from "@utils";
import { growAnimation } from "@animations";
import { BlockComponent } from "../../block/block.component";
import { FVPComponent } from "../fvp/fvp.component";

@Component({
    selector: "app-branch",
    standalone: true,
    imports: [
        BlockComponent,
        ContextMenuDirective,
        FVPComponent,
        EditableComponent,
        LazyComponent,
        LazyTargetDirective,
    ],
    templateUrl: "./branch.component.html",
    styleUrl: "./branch.component.scss",
    animations: [growAnimation({ direction: "vertical", duration: "0.2s" })],
})
export class BranchComponent {
    @Output() readonly removed = new EventEmitter();

    readonly contextMenu: IContextMenuOption[] = [
        {
            text: "Remove branch",
            action: () => this.removed.emit(),
        },
        {
            text: "Add task",
            action: () => this.tasks.add(),
        },
        {
            text: "Add process",
            action: () => this.processes.add(),
        },
    ];

    private _branch?: DBEntry<"branch">;
    private _tasks?: LazyCollection<"task">;
    private _processes?: LazyCollection<"process">;

    constructor(private readonly proxy: ProxifierService) {}

    @Input("branch") set branch(value: DBEntry<"branch">) {
        this._branch = value;
        this._tasks = this.proxy.lazyCollection("task", {
            ids: value.tasks,
            initialValue: {
                branch: this.branch,
                title: "New task",
                description: "",
                product: "",
            },
        });
        this._processes = this.proxy.lazyCollection("process", {
            ids: value.processes,
            initialValue: {
                branch: this.branch,
                title: "New process",
                description: "",
                product: "",
            },
        });
    }

    get branch() {
        return this._branch!;
    }

    get tasks() {
        return this._tasks!;
    }

    get processes() {
        return this._processes!;
    }
}
