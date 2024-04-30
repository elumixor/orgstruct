import { Component, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterOutlet } from "@angular/router";
import { PrimeNGConfig } from "primeng/api";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {
    private readonly titleService = inject(Title);
    private readonly primengConfig = inject(PrimeNGConfig);

    constructor() {
        this.primengConfig.ripple = true;
        this.titleService.setTitle("Angular Boilerplate");
    }
}
