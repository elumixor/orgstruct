import { Component, ElementRef, EventEmitter, ViewChild } from "@angular/core";
import type { AnimationEvent } from "@angular/animations";
import { FormsModule } from "@angular/forms";
import { appear, fade } from "@animations";
import { ButtonComponent, ClickDirective, IconComponent } from "@components";
import { nextEvent } from "@utils";

@Component({
    selector: "app-dialog",
    standalone: true,
    imports: [ButtonComponent, ClickDirective, FormsModule, IconComponent],
    templateUrl: "./dialog.component.html",
    styleUrl: "./dialog.component.scss",
    animations: [appear("appear", { translateX: "0px" }), fade("fade")],
})
export class DialogComponent {
    readonly resolved = new EventEmitter<boolean>();

    title = "Set value";
    value = "Top kek";
    icon?: string;
    isShown = false;

    @ViewChild("input") input!: ElementRef<HTMLInputElement>;

    constructor() {
        this.resolved.subscribe(() => {
            this.isShown = false;
        });
    }

    async prompt(
        title: string,
        currentValue: string,
        options?: { icon?: string },
    ): Promise<{ success: true; value: string } | { success: false }> {
        this.title = title;
        this.value = currentValue;
        this.icon = options?.icon;
        this.isShown = true;

        const success = await nextEvent(this.resolved);
        this.isShown = false;

        if (success) return { success, value: this.value };
        else return { success: false };
    }

    onAppeared(e: AnimationEvent) {
        if (e.toState !== "void") this.input.nativeElement.focus();
    }
}
