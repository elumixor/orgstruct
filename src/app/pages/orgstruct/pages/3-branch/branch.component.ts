import { Component, Input, inject } from "@angular/core";
import { ContextMenuDirective, EditableComponent, LazyDirective, type IContextMenuOption } from "@components";
import { TaskComponent } from "../../items/task/task.component";
import { DataService, type LazyCollection } from "@services";
import type { MetaPlain } from "@utils";

@Component({
    selector: "app-branch",
    standalone: true,
    imports: [ContextMenuDirective, TaskComponent, EditableComponent, LazyDirective],
    templateUrl: "./branch.component.html",
    styleUrl: "./branch.component.scss",
})
export class BranchComponent {
    private readonly proxy = inject(DataService);

    private _branch?: MetaPlain<"branch">;

    tasks?: LazyCollection<"task">;

    @Input({ required: true }) set branch(value: MetaPlain<"branch">) {
        this._branch = value;
        this.tasks = this.proxy.lazyArray("task", {
            initializer: {
                branch: { id: value.id },
                title: "New task",
                description: "Description of the task",
                product: "Final Valuable Product that the task produces",
            },
        });
    }

    get branch() {
        return this._branch!;
    }

    contextOptions(task?: MetaPlain<"task">) {
        const options: IContextMenuOption[] = [
            {
                text: "Add task",
                action: () => this.tasks?.add(),
            },
        ];

        if (task) {
            options.push({
                text: "Remove task",
                flavor: "danger",
                action: () => this.tasks?.remove(task),
            });
        }

        return options;
    }
}
