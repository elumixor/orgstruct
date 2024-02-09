import { animate, state, style, transition, trigger, AnimationEvent } from "@angular/animations";
import { NgTemplateOutlet } from "@angular/common";
import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ContentChild,
    ElementRef,
    Input,
    TemplateRef,
    ViewChild,
    signal,
} from "@angular/core";
import { LazyTargetDirective, LoaderComponent } from "@components";

@Component({
    selector: "app-lazy",
    standalone: true,
    imports: [NgTemplateOutlet, LoaderComponent],
    templateUrl: "./lazy.component.html",
    styleUrl: "./lazy.component.scss",
    animations: [
        trigger("fadeIn", [
            state("in", style({ opacity: "1" })),
            transition("void => *", [style({ opacity: "0" }), animate("0.2s ease-in-out")]),
        ]),
        trigger("grow", [
            state("out", style({ width: "{{width}}", height: "{{height}}", opacity: 0 }), {
                params: { width: "auto", height: "auto" },
            }),
            transition("* => out", [animate("0.3s ease-in-out")]),
            transition("void => *", [style({ width: "0", height: "0", opacity: 0 }), animate("0.5s ease-in-out")]),
        ]),
        // growAnimation({ name: "myGrow" }),
    ],
})
export class LazyComponent implements AfterViewInit, AfterViewChecked {
    @ContentChild(LazyTargetDirective, { read: TemplateRef }) readonly body!: TemplateRef<unknown>;
    @Input() loadText: string | null = null;
    @Input() minTime = 0;

    readonly showContent = signal(false);
    readonly shouldGrow = signal(false);
    readonly timeElapsed = signal(false);
    readonly renderTemplate = signal(false);

    readonly animationParams = signal<Record<string, unknown>>({});

    @ViewChild("invisibleRef") private readonly invisibleRef?: ElementRef<HTMLElement>;

    @Input({ required: true }) set when(value: unknown) {
        this.renderTemplate.set(!!value);
    }

    onGrowDone(event: AnimationEvent) {
        if (event.toState === "out") this.showContent.set(true);
    }

    ngAfterViewInit() {
        if (this.minTime > 0) setTimeout(() => this.timeElapsed.set(true), this.minTime * 1000);
        else this.timeElapsed.set(true);
    }

    ngAfterViewChecked() {
        if (this.shouldGrow() || !this.renderTemplate()) return;

        const { offsetWidth, offsetHeight } = this.invisibleRef!.nativeElement;

        this.animationParams.set({ width: `${offsetWidth}px`, height: `${offsetHeight}px` });
        this.shouldGrow.set(true);
    }
}
