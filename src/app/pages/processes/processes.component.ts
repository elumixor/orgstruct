import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
    ButtonComponent,
    ClickDirective,
    ContextOptions,
    EditableComponent,
    IconComponent,
    WithContextDirective,
    WithIconComponent,
} from "@components";
import { newProcess, type IProcess } from "@domain";
import { ProcessesService } from "@services";
import { ProcessDetailComponent } from "../process-detail/process-detail.component";
import { TaskEditorComponent } from "../process-detail/task-editor/task-editor.component";

@Component({
    selector: "app-processes",
    standalone: true,
    imports: [
        ProcessDetailComponent,
        TaskEditorComponent,
        EditableComponent,
        ClickDirective,
        WithContextDirective,
        WithIconComponent,
        IconComponent,
        ButtonComponent,
    ],
    templateUrl: "./processes.component.html",
    styleUrl: "./processes.component.scss",
})
export class ProcessesComponent {
    readonly dummy = new ContextOptions();
    readonly processes = inject(ProcessesService).processes;

    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    addProcess() {
        this.processes.push(newProcess());
    }

    selectProcess(index: number) {
        void this.router.navigate([index], { relativeTo: this.route });
    }

    contextOptions(process: IProcess) {
        return new ContextOptions().withDanger("Remove", () => this.processes.remove(process), {
            icon: "remove.svg",
            shortcut: "Del",
        });
    }
}
