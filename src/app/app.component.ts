import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { BackgroundComponent, ErrorMessageComponent } from "@components";
import { ContextMenuRootDirective } from "@components/context-menu/context-menu-root.directive";
import { DialogComponent } from "@components/dialog/dialog.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        ErrorMessageComponent,
        BackgroundComponent,
        ContextMenuRootDirective,
        DialogComponent,
    ],
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppComponent {}
