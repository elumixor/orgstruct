import { Component, Input, inject } from "@angular/core";
import { EditableComponent, LazyForDirective, type ContextMenuOption } from "@components";
import { TaskComponent } from "../../items/task/task.component";
import { DataService, type Lazy } from "@services";
import { newTask, type MetaPlain } from "@domain";

@Component({
    selector: "app-branch",
    standalone: true,
    imports: [TaskComponent, EditableComponent, LazyForDirective],
    templateUrl: "./branch.component.html",
    styleUrl: "./branch.component.scss",
})
export class BranchComponent {
    private readonly data = inject(DataService);
    readonly tasks = this.data.arrayOfLazy("task");

    private _branch!: MetaPlain<"branch">;

    @Input({ required: true }) set branch(value: MetaPlain<"branch">) {
        this._branch = value;
        this.tasks.set(this.data.lazifyIds("task", value.tasks));
    }

    get branch() {
        return this._branch;
    }

    contextOptions(task?: Lazy<"task">) {
        const options: ContextMenuOption[] = [
            {
                title: "Add task",
                action: () => this.tasks.add(this.data.lazifyFrom("task", newTask(this.branch))),
            },
        ];

        if (task) {
            options.push({
                title: "Remove task",
                flavor: "danger",
                action: () => this.tasks.remove(task),
            });
        }

        return options;
    }
}
