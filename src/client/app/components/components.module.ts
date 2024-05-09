import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PopupModule } from "./popup";
import { PrimeModule } from "./prime.module";
import { SelectComponent } from "./select/select.component";
import { SelectItemDirective } from "./select/select-item.directive";
import { SelectButtonDirective } from "./select/select-button.directive";
import { TagComponent } from "./tag/tag.component";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        PopupModule,
        PrimeModule,
        SelectComponent,
        SelectItemDirective,
        SelectButtonDirective,
        TagComponent,
    ],
    exports: [PopupModule, PrimeModule, SelectComponent, SelectItemDirective, SelectButtonDirective, TagComponent],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ComponentsModule {}
