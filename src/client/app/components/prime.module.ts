import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ColorPickerModule } from "primeng/colorpicker";
import { DividerModule } from "primeng/divider";
import { DragDropModule } from "primeng/dragdrop";
import { InputGroupModule } from "primeng/inputgroup";
import { InputTextModule } from "primeng/inputtext";
import { PanelModule } from "primeng/panel";
import { TagModule } from "primeng/tag";
import { ToggleButtonModule } from "primeng/togglebutton";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DragDropModule,
        CardModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        DividerModule,
        InputGroupModule,
        PanelModule,
        TagModule,
        ColorPickerModule,
        ToggleButtonModule,
        CalendarModule,
        MultiSelectModule,
    ],
    exports: [
        CardModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        DividerModule,
        InputGroupModule,
        PanelModule,
        TagModule,
        ColorPickerModule,
        ToggleButtonModule,
        CalendarModule,
        MultiSelectModule,
    ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PrimeModule {}
