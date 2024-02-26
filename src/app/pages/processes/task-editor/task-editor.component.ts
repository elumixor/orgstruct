import { trigger, transition, group, style, animate } from "@angular/animations";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ButtonComponent, ContextMenuDirective, EditableComponent } from "@components";
import type { IProcess } from "@domain";

@Component({
    selector: "app-task-editor",
    standalone: true,
    imports: [EditableComponent, ButtonComponent, ContextMenuDirective],
    templateUrl: "./task-editor.component.html",
    styleUrl: "./task-editor.component.scss",
    animations: [
        trigger("appear", [
            transition(":enter", [
                style({
                    opacity: 0,
                    backdropFilter: "blur(10px)",
                    top: "calc(50% + 25px)",
                }),
                animate("0.2s ease-out", style({ opacity: 1, backdropFilter: "blur(10px)", top: "50%" })),
            ]),
        ]),
    ],
})
export class TaskEditorComponent {
    @Input({ required: true }) task!: IProcess;
    @Output() closed = new EventEmitter();

    readonly contextOptions = [
        {
            text: "Add dependency",
            action: () => this.task.dependencies.push("New dependency"),
        },
        {
            text: "Add event",
            action: () => this.task.events.push({ title: "New event", product: "Event product" }),
        },
        {
            text: "Add output",
            action: () => this.task.outputs.push({ outcome: "default", product: "Output product" }),
        },
    ];

    addEvent() {
        this.task.events.push({ title: "New event", product: "Event product" });
    }

    addOutput() {
        this.task.outputs.push({ outcome: "default", product: "Output product" });
    }

    addDependency() {
        this.task.dependencies.push("New dependency");
    }
}
