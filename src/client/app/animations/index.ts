import { animate, style, transition, trigger } from "@angular/animations";

export function appear(
    triggerName: string,
    { duration = "0.3s", translateX = "0px", translateY = "0px", scale = 1 } = {},
) {
    const transform = `scale(${scale}) translate(${translateX}, ${translateY})`;
    const baseStyle = { opacity: 0, transform };

    return trigger(triggerName, [
        transition(":enter", [
            style(baseStyle),
            animate(duration, style({ opacity: 1, transform: "scale(1) translate(0px, 0px)" })),
        ]),
        transition(":leave", [animate(duration, style(baseStyle))]),
    ]);
}
