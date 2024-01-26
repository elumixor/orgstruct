import { Component, HostBinding, HostListener, Input } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { ImageWithTextComponent } from "../../image-with-text/image-with-text.component";

@Component({
    selector: "app-nav-bar-item",
    standalone: true,
    imports: [ImageWithTextComponent],
    templateUrl: "./nav-bar-item.component.html",
    styleUrl: "./nav-bar-item.component.scss",
})
export class NavBarItemComponent {
    @Input() text = "";
    @Input() image?: string;
    @Input() path = "";

    private _selected = false;

    constructor(private readonly router: Router) {
        this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((data) => {
            this._selected = (data as NavigationEnd).url === this.path;
        });
    }

    @HostBinding("class.selected")
    get selected() {
        return this._selected;
    }

    @HostListener("click")
    onClick() {
        this.router.navigate([this.path]);
    }
}
