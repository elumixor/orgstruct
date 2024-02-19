import {
    type AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    QueryList,
    ViewChild,
    ViewChildren,
    inject,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CardsManagerComponent } from "./cards-manager/cards-manager.component";
import { CardContentDirective } from "./cards-manager/card-content.directive";
import { MainComponent } from "./pages/0-main/main.component";

@Component({
    selector: "app-orgstruct",
    standalone: true,
    imports: [CardsManagerComponent, CardContentDirective, MainComponent],
    templateUrl: "./orgstruct.component.html",
    styleUrl: "./orgstruct.component.scss",
})
export class OrgstructComponent implements AfterViewInit {
    private readonly zone = inject(NgZone);
    private readonly changeDetector = inject(ChangeDetectorRef);
    private readonly platform = inject(PLATFORM_ID);

    @ViewChild("backgroundRef") private readonly backgroundRef?: ElementRef<HTMLElement>;

    @ViewChild(CardsManagerComponent, { read: ElementRef }) private readonly cardsManagerRef?: ElementRef<HTMLElement>;
    @ViewChild(CardsManagerComponent) private readonly cardsManager?: CardsManagerComponent;

    @ViewChildren(CardContentDirective) private readonly contentDirectives?: QueryList<CardContentDirective>;

    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platform)) return;

        this.zone.runOutsideAngular(() => {
            const bg = this.backgroundRef?.nativeElement;
            const fg = this.cardsManagerRef?.nativeElement;

            // Move the cards when the mouse moves
            window.addEventListener(
                "pointermove",
                (event) => {
                    if (!bg || !fg) return;
                    const angleX = (event.clientX / bg.offsetWidth - 0.5) * -20;
                    const angleY = (event.clientY / bg.offsetHeight - 0.5) * 10;
                    fg.style.transform = `translateX(${angleX}px) translateY(${-angleY}px)`;
                },
                { passive: true },
            );

            // Center the cards when the mouse leaves the background
            document.addEventListener(
                "pointerleave",
                () => {
                    if (!fg) return;
                    fg.style.transform = "translateX(0px) translateY(0px)";
                },
                { passive: true },
            );
        });

        const firstDirective = this.contentDirectives?.first;
        if (firstDirective) this.cardsManager?.push(firstDirective);

        // needed because we update the view (pushing the first content directive) after it was changed
        this.changeDetector.detectChanges();
    }
}
