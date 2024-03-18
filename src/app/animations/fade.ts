import { animate, style, transition, trigger } from "@angular/animations";

export function fade(triggerName: string, { duration = "0.15s" } = {}) {
    return trigger(triggerName, [
        transition(":enter", [style({ opacity: 0 }), animate(duration, style({ opacity: 1 }))]),
        transition(":leave", [animate(duration, style({ opacity: 0 }))]),
    ]);
}
