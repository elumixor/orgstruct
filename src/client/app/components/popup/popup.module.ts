import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PopupContentDirective } from "./popup-content.directive";
import { PopupComponent } from "./popup.component";

@NgModule({
    declarations: [],
    imports: [CommonModule, PopupContentDirective, PopupComponent],
    exports: [PopupContentDirective, PopupComponent],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PopupModule {}
