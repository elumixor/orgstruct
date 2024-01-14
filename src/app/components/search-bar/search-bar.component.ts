import { Component, ElementRef, EventEmitter, Output, ViewChild } from "@angular/core";

@Component({
    selector: "app-search-bar",
    standalone: true,
    imports: [],
    templateUrl: "./search-bar.component.html",
    styleUrl: "./search-bar.component.scss",
})
export class SearchBarComponent {
    @Output() changed = new EventEmitter<string>();
    @ViewChild("inputRef") input?: ElementRef<HTMLInputElement>;

    onInput() {
        if (!this.input) return;
        this.changed.emit(this.input.nativeElement.value);
    }
}
