import {
    Component,
    ElementRef,
    Input,
    ViewChild,
    afterNextRender,
} from "@angular/core";

@Component({
    selector: "app-auto-fit-text",
    standalone: true,
    imports: [],
    templateUrl: "./auto-fit-text.component.html",
    styleUrl: "./auto-fit-text.component.scss",
})
export class AutoFitTextComponent {
    @Input() text = "";
    @Input() justifyContent: "center" | "flex-start" | "flex-end" = "center";
    @ViewChild("textRef") textElementRef?: ElementRef<HTMLParagraphElement>;
    @ViewChild("containerRef") containerElementRef?: ElementRef<HTMLDivElement>;

    constructor() {
        afterNextRender(() => {
            if (!this.textElementRef || !this.containerElementRef)
                throw new Error("No textElementRef");

            const textElement = this.textElementRef.nativeElement;
            const containerElement = this.containerElementRef.nativeElement;

            const isInside = () => {
                // We'll need to get the bounding boxes of the container and the text
                const bbContainer = containerElement.getBoundingClientRect();
                const bbText = textElement.getBoundingClientRect();

                // Check if text already fits, in this case we don't need to do anything
                return (
                    bbContainer.width >= bbText.width &&
                    bbContainer.height >= bbText.height
                );
            };

            if (!isInside()) {
                // We will use an iterative approach to determine the font size
                let fontSize = 50;
                let step = 50;
                while (step > 1) {
                    textElement.style.fontSize = `${fontSize}%`;

                    step /= 2;

                    if (isInside()) fontSize += step;
                    else fontSize -= step;
                }

                // Finally, we'll set the font size
                textElement.style.fontSize = `${fontSize}%`;
            }

            textElement.style.opacity = "1";
        });
    }
}
