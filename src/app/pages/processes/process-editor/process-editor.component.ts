import { animate, group, style, transition, trigger } from "@angular/animations";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ButtonComponent, ClickDirective, ContextMenuDirective, EditableComponent } from "@components";
import { newProcess, type IProcess } from "@domain";

@Component({
    selector: "app-process-editor",
    standalone: true,
    imports: [ContextMenuDirective, EditableComponent, ButtonComponent, ClickDirective],
    templateUrl: "./process-editor.component.html",
    styleUrls: ["./process-editor.component.scss"],
    animations: [
        trigger("appear", [
            transition(":enter", [
                group([
                    style({
                        opacity: 0,
                        filter: "blur(20px)",
                        transform: "scale(0.8)",
                        backgroundColor: "rgba(0 0 0 / 0%)",
                    }),
                    animate("0.5s ease-out", style({ opacity: 1, filter: "blur(0px)", transform: "scale(1)" })),
                    animate("0.5s 0.4s ease-in-out", style({ backgroundColor: "rgba(0 0 0 / 30%)" })),
                ]),
            ]),
        ]),
    ],
})
export class ProcessEditorComponent {
    @Input({ required: true }) process!: IProcess;
    @Input() path = "";
    @Output() readonly closed = new EventEmitter();
    @Output() readonly taskSelected = new EventEmitter<IProcess>();
    @Output() readonly processSelected = new EventEmitter<IProcess>();

    readonly editorCO = [
        {
            text: "Add task",
            action: () => this.process.subtasks.push({ ...newProcess(), title: "New task" }),
        },
    ];

    get subtasks() {
        return this.process.subtasks;
    }

    get stages() {
        const stages = this.subtasks.map((t) => t.stage).unique();
        stages.sort();
        return stages;
    }

    get numStages() {
        return this.subtasks.map((t) => t.stage).unique().length;
    }

    get responsibilities() {
        return this.subtasks
            .map((t) => t.responsibility)
            .unique((a, b) => {
                if (typeof a === "string" && typeof b === "string") return a === b;
                if (typeof a === "string" || typeof b === "string") return false;
                return a.id === b.id;
            });
    }

    showEditor(task: IProcess) {
        const isProcess = task.subtasks.nonEmpty;
        if (isProcess) this.processSelected.emit(task);
        else this.taskSelected.emit(task);
    }
}
