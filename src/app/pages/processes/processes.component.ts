import { NgComponentOutlet, isPlatformBrowser } from "@angular/common";
import {
    Component,
    EventEmitter,
    Input,
    Output,
    PLATFORM_ID,
    inject,
    type AfterViewChecked,
    type OnInit,
} from "@angular/core";
import {
    ClickDirective,
    ContextMenuDirective,
    EditableComponent,
    IconComponent,
    ListForDirective,
    WithIconComponent,
} from "@components";
import { newProcess, type IProcess } from "@domain";
import { signalArray } from "@utils";
import { ProcessEditorComponent } from "./process-editor/process-editor.component";
import { TaskEditorComponent } from "./task-editor/task-editor.component";

@Component({
    selector: "app-with-context",
    standalone: true,
    imports: [NgComponentOutlet],
    template: `
        <div class="relative" (pointerenter)="visible = true" (pointerleave)="visible = false">
            <ng-content></ng-content>
            @if (visible) {
                <div class="absolute context-options flex">
                    <ng-content select="app-context-option"></ng-content>
                </div>
            }
        </div>
    `,
    styles: [
        `
            .context-options {
                right: 0;
                top: 0;
                transform: translateY(-50%);
                border-radius: 5px;
                background: linear-gradient(180deg, rgb(0 0 0 / 10%) 0%, rgb(0 0 0 / 0%) 100%);
                padding: 2px;
                gap: 2px;
            }
        `,
    ],
})
export class WithContextComponent {
    visible = false;
}

@Component({
    selector: "app-context-option",
    standalone: true,
    imports: [ClickDirective],
    template: `
        <div class="option flavor-{{ flavor }}" (appClick)="action.emit()">
            <ng-content></ng-content>
        </div>
    `,
    styles: [
        `
            .option {
                display: inline-block;
            }
        `,
    ],
})
export class ContextOptionComponent {
    @Output() action = new EventEmitter();
    @Input() flavor: "default" | "danger" | "warning" = "default";
}

@Component({
    selector: "app-processes",
    standalone: true,
    imports: [
        ContextMenuDirective,
        ListForDirective,
        ProcessEditorComponent,
        TaskEditorComponent,
        EditableComponent,
        ClickDirective,
        WithContextComponent,
        ContextOptionComponent,
        WithIconComponent,
        IconComponent,
    ],
    templateUrl: "./processes.component.html",
    styleUrl: "./processes.component.scss",
})
export class ProcessesComponent implements OnInit, AfterViewChecked {
    private readonly platformId = inject(PLATFORM_ID);

    processes = signalArray<IProcess>();
    selectedProcess?: IProcess;
    selectedTask?: IProcess;
    currentPath = "";

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            let jsonData: IProcess[];
            try {
                jsonData = JSON.parse(localStorage.getItem("processes") ?? "[]") as IProcess[];
            } catch (error) {
                // eslint-disable-next-line no-console
                console.warn("Could not parse jsonData for the processes", error);
                jsonData = [];
            }

            this.processes.set(jsonData);
        }

        const first = this.processes().first as IProcess | undefined;
        if (first) this.selectProcess(first);
        // if (first?.subtasks.nonEmpty) this.selectedTask = first.subtasks.first;
    }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) localStorage.setItem("processes", JSON.stringify(this.processes()));
    }

    removeProcess(process: IProcess) {
        this.processes.remove(process);
    }

    addProcess() {
        this.processes.add(newProcess());
    }

    selectProcess(process: IProcess) {
        this.selectedProcess = process;
        this.currentPath = process.title;
    }
}
