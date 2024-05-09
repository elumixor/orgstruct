import { NgTemplateOutlet } from "@angular/common";
import { Component, TemplateRef, computed, contentChild, input, model, viewChild } from "@angular/core";
import { PopupModule } from "../popup";
import { PopupComponent } from "../popup/popup.component";
import { PrimeModule } from "../prime.module";
import { SelectItemDirective } from "./select-item.directive";
import { SelectButtonDirective } from "./select-button.directive";

export interface ISelectItem<T> {
    label?: string;
    value: T;
    icon?: string;
    disabled?: boolean;
}

@Component({
    selector: "app-select",
    standalone: true,
    imports: [PopupModule, PrimeModule, NgTemplateOutlet],
    templateUrl: "./select.component.html",
    styleUrl: "./select.component.scss",
})
export class SelectComponent<T> {
    readonly items = input.required<ISelectItem<T>[]>();
    readonly value = model.required<T[]>();
    readonly placeholder = input<string>();

    readonly itemTemplate = contentChild(SelectItemDirective, { read: TemplateRef });
    readonly buttonTemplate = contentChild(SelectButtonDirective, { read: TemplateRef });

    readonly selected = computed(() => {
        const v = this.value();
        const items = this.items();
        return items.filter((i) => v.includes(i.value));
    });

    readonly inline = input(false);
    readonly multiple = input(false);
    readonly required = input(false);

    private readonly popup = viewChild.required(PopupComponent);

    isSelected(item: ISelectItem<T>) {
        return this.value().includes(item.value);
    }

    toggle(event: Event) {
        this.popup().toggle(event);
    }
    show(event: Event) {
        this.popup().show(event);
    }
    hide() {
        this.popup().hide();
    }

    select(item: ISelectItem<T>) {
        if (this.multiple()) this.value.update((v) => [...v.toggle(item.value)]);
        else this.value.update((v) => (v.includes(item.value) ? [] : [item.value]));
    }
}
