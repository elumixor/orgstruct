import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ClickDirective } from "@components/click.directive";

@Component({
    selector: "app-button",
    standalone: true,
    imports: [ClickDirective],
    templateUrl: "./button.component.html",
    styleUrl: "./button.component.scss",
})
export class ButtonComponent {
    @Input() text = "Button";
    @Input() set key(value: string) {
        document.addEventListener("keydown", (event) => {
            if (event.key === value) this.clicked.emit();
        });
    }

    @Output() readonly clicked = new EventEmitter();
}
