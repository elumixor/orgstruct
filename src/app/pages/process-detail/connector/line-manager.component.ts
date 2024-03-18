import { Component, Input, inject } from "@angular/core";
import { ConnectorService } from "./connector.service";
import { LineComponent } from "./line.component";

@Component({
    selector: "app-line-manager",
    standalone: true,
    imports: [LineComponent],
    template: `
        <svg>
            <g [attr.transform]="transform">
                @for (line of lines(); track line) {
                    <g
                        app-line
                        [from]="line.from()"
                        [to]="line.to()"
                        [anchorType]="line.anchorType"
                        (removed)="connector.removeLine(line.id)"
                    ></g>
                }
            </g>
        </svg>
    `,
    styles: [
        `
            svg {
                position: absolute;
                pointer-events: none;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        `,
    ],
})
export class LineManagerComponent {
    protected readonly connector = inject(ConnectorService);
    readonly lines = this.connector.lines;

    @Input() x = 0;
    @Input() y = 0;

    get transform() {
        return `translate(${this.x}, ${this.y})`;
    }
}
