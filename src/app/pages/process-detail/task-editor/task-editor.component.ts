import { animate, style, transition, trigger } from "@angular/animations";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ButtonComponent, EditableComponent, WithIconComponent } from "@components";
import type { IProcess } from "@domain";

@Component({
    selector: "app-task-editor",
    standalone: true,
    imports: [EditableComponent, ButtonComponent, WithIconComponent],
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
    @Input({ required: true }) parentProcess!: IProcess;
    @Output() closed = new EventEmitter();

    addEvent() {
        this.task.events.push({ title: "New event", product: "Event product" });
    }

    addOutput() {
        this.task.outputs.push({ outcome: "default", product: "Output product" });
    }

    addDependency() {
        this.task.dependencies.push("New dependency");
    }

    sections;

    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;

        this.sections = [
            {
                title: "Dependencies",
                icon: "input.svg",
                addItemTitle: "Add dependency",
                addItem: this.addDependency.bind(this),
                get items() {
                    return self.task.dependencies;
                },
            },
            {
                title: "Events",
                icon: "event.svg",
                addItemTitle: "Add event",
                addItem: this.addEvent.bind(this),
                get items() {
                    return self.task.events;
                },
            },
            {
                title: "Outputs",
                icon: "output.svg",
                addItemTitle: "Add output",
                addItem: this.addOutput.bind(this),
                get items() {
                    return self.task.outputs;
                },
            },
        ];
    }
}
