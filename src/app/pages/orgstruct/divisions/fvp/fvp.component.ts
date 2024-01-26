import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EditableComponent } from "@components";

@Component({
    selector: "app-fvp",
    standalone: true,
    imports: [EditableComponent],
    templateUrl: "./fvp.component.html",
    styleUrl: "./fvp.component.scss",
})
export class FVPComponent {
    @Input({ required: true }) fvp!: string;
    @Output() fvpChange = new EventEmitter<string>();

    updateFVP(value: string) {
        this.fvp = value;
        this.fvpChange.emit(value);
    }
}
