import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { ContextMenuComponent, NavBarComponent } from "./components";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, NavBarComponent, RouterLink, RouterLinkActive, ContextMenuComponent],
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {}
