import { isPlatformBrowser } from "@angular/common";
import { Component, PLATFORM_ID, inject, type AfterViewChecked, type OnInit } from "@angular/core";
import { ContextMenuDirective, EditableComponent, WithIconComponent, type IContextMenuOption } from "@components";
import { ProcessEditorComponent } from "./process-editor/process-editor.component";
import { newProcess, type IProcess } from "@domain";
import { TaskEditorComponent } from "./task-editor/task-editor.component";

@Component({
    selector: "app-processes",
    standalone: true,
    imports: [ContextMenuDirective, ProcessEditorComponent, TaskEditorComponent, EditableComponent, WithIconComponent],
    templateUrl: "./processes.component.html",
    styleUrl: "./processes.component.scss",
})
export class ProcessesComponent implements OnInit, AfterViewChecked {
    private readonly platformId = inject(PLATFORM_ID);

    processes = [] as IProcess[];
    selectedProcess?: IProcess;
    selectedTask?: IProcess;
    currentPath = "";

    ngOnInit() {
        if (isPlatformBrowser(this.platformId))
            this.processes = JSON.parse(localStorage.getItem("processes") ?? "[]") as IProcess[];
        const first = this.processes.first as IProcess | undefined;
        if (first) this.selectProcess(first);
        if (first?.subtasks.nonEmpty) this.selectedTask = first.subtasks.first;
    }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) localStorage.setItem("processes", JSON.stringify(this.processes));
    }

    contextOptions(process?: IProcess) {
        const options: IContextMenuOption[] = [
            {
                text: "Add process",
                action: () => this.processes.push(newProcess()),
                icon: "add.svg",
            },
        ];

        if (process)
            options.push({
                text: "Remove process",
                action: () => this.processes.remove(process),
                flavor: "danger",
                icon: "remove.svg",
            });

        return options;
    }

    selectProcess(process: IProcess) {
        this.selectedProcess = process;
        this.currentPath = process.title;
    }
}
