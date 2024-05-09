import { Component, input } from "@angular/core";
import type { IPropertyDescriptor, Task } from "@shared";
import { ComponentsModule } from "../components/components.module";
import { PropertyEditorComponent } from "../property-editors/property-editor/property-editor.component";

@Component({
    selector: "app-board-card",
    standalone: true,
    imports: [ComponentsModule, PropertyEditorComponent],
    templateUrl: "./board-card.component.html",
    styleUrl: "./board-card.component.scss",
})
export class BoardCardComponent {
    readonly task = input.required<Task>();
    readonly properties = input.required<IPropertyDescriptor[]>();
}
