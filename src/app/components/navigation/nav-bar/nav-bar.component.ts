import { Component } from "@angular/core";
import { NavBarItemComponent } from "../nav-bar-item/nav-bar-item.component";

@Component({
    selector: "app-nav-bar",
    standalone: true,
    imports: [NavBarItemComponent],
    templateUrl: "./nav-bar.component.html",
    styleUrl: "./nav-bar.component.scss",
})
export class NavBarComponent {}
