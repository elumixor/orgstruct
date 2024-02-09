import { Component } from "@angular/core";
import { NetworkService } from "@services";

@Component({
    selector: "app-error-message",
    standalone: true,
    imports: [],
    templateUrl: "./error-message.component.html",
    styleUrl: "./error-message.component.scss",
})
export class ErrorMessageComponent {
    readonly error;

    constructor(private readonly network: NetworkService) {
        this.error = network.currentError;
    }
}
