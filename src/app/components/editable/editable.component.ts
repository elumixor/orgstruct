import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "app-editable",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./editable.component.html",
    styleUrl: "./editable.component.scss",
})
export class EditableComponent {
    @Input() placeholder = "Placeholder text...";
    @Output() textChange = new EventEmitter<string>();
    focused = false;

    @ViewChild("inputRef") protected readonly inputRef?: ElementRef<HTMLInputElement>;

    protected _text?: string;
    protected previousText?: string;

    @Input()
    set text(value: string | undefined) {
        this._text = value;
        this.previousText = value;
    }

    get text() {
        return this._text;
    }

    // cancel() {
    //     console.log("cancel");
    //     this._text = this.previousText;
    // }

    blur() {
        this.focused = false;
        this.inputRef?.nativeElement.blur();
        this.sync();
    }

    focus() {
        this.focused = true;
    }

    protected sync() {
        this.previousText = this._text;
        this.textChange.emit(this._text);
    }
}
