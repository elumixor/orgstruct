import { Component, Input } from "@angular/core";

@Component({
    selector: "app-office",
    standalone: true,
    imports: [],
    templateUrl: "./office.component.html",
    styleUrl: "./office.component.scss",
})
export class OfficeComponent {
    @Input({ required: true }) office!: { name: string };
}
