import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ClickDirective } from "@components/click.directive";
import { WithIconComponent } from "@components/with-icon.component";
import { ShortcutComponent } from "./shortcut.component";

@Component({
    selector: "app-button",
    standalone: true,
    imports: [ClickDirective, WithIconComponent, ShortcutComponent],
    template: `
        <app-with-icon class="button" (appClick)="clicked.emit($event)" [icon]="icon">
            <div class="flex gap-5">
                <ng-content></ng-content>
                @if (shortcut) {
                    <app-shortcut [shortcut]="shortcut" (pressed)="clicked.emit($event)" />
                }
            </div>
        </app-with-icon>
    `,
    styles: [
        `
            .button {
                display: inline-flex;

                --fg-color: var(--secondary);
                color: var(--fg-color);

                padding: 0.5rem 1rem;
                background-color: color-mix(in srgb, var(--fg-color) 20%, transparent);
                border: 2px solid var(--secondary);
                border-radius: 5px;

                &:hover {
                    background-color: color-mix(in srgb, var(--fg-color) 20%, white);
                    transform: var(--scale-action);
                }

                transition: all 0.3s;

                flex-grow: 1;
                cursor: pointer;
                user-select: none;
            }
        `,
    ],
})
export class ButtonComponent {
    @Input() icon?: string;
    @Input() shortcut?: string;
    @Output() readonly clicked = new EventEmitter<Event>();
}
