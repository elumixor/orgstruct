import { animate, style, transition, trigger } from "@angular/animations";

export function appear(triggerName: string, { duration = "0.15s", translateX = "-5px", translateY = "5px" } = {}) {
    return trigger(triggerName, [
        transition(":enter", [
            style({ opacity: 0, transform: `scale(0.95) translate(${translateX}, ${translateY})` }),
            animate(duration, style({ opacity: 1, transform: "scale(1) translate(0px, 0px)" })),
        ]),
        transition(":leave", [animate(duration, style({ opacity: 0 }))]),
    ]);
}
