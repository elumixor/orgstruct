import { isPlatformBrowser } from "@angular/common";
import { Component, PLATFORM_ID, inject, type AfterViewChecked, type OnInit } from "@angular/core";
import { ContextMenuDirective, EditableComponent, type IContextMenuOption } from "@components";
import { ProcessEditorComponent } from "./process-editor/process-editor.component";
import { newProcess, type IProcess } from "@domain";
import { TaskEditorComponent } from "./task-editor/task-editor.component";

@Component({
    selector: "app-processes",
    standalone: true,
    imports: [ContextMenuDirective, ProcessEditorComponent, TaskEditorComponent, EditableComponent],
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

    contextOptions() {
        return [
            {
                text: "Add process",
                action: () => this.processes.push(newProcess()),
            },
        ] satisfies IContextMenuOption[];
    }

    selectProcess(process: IProcess) {
        this.selectedProcess = process;
        this.currentPath = process.title;
    }
}
