import { trigger, state, style, transition, animate } from "@angular/animations";

export const flyInOutAnimation = trigger("flyInOut", [
    state("in", style({ opacity: "1", margin: "15px" })),
    transition("void => *", [style({ opacity: "0" }), animate("0.2s ease-in-out")]),
    transition("* => void", [animate("0.5s ease-out", style({ opacity: "0", margin: "0" }))]),
]);

export const growAnimation = ({
    name = "grow",
    direction = "both",
    duration = "0.5s",
}: { direction?: "vertical" | "horizontal" | "both"; duration?: `${number}${"s" | "ms"}`; name?: string } = {}) => {
    const startParams: { height?: string; width?: string; transform: string } = {
        height: "0",
        width: "0",
        transform: "scale(0)",
    };
    if (direction === "vertical") delete startParams.width;
    if (direction === "horizontal") delete startParams.height;

    return trigger(name, [
        state("in", style({ height: "unset", width: "unset", transform: "scale(1)" })),
        transition("void => *", [style(startParams), animate(`${duration} ease-in-out`)]),
    ]);
};
