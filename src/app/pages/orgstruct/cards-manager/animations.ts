import { trigger, state, style, transition, animate } from "@angular/animations";

export const animations = trigger("added", [
    state(
        "void",
        style({
            opacity: 0,
            filter: "blur(20px)",
            transform: "scale(1.5) translate({{x}}px, {{y}}px)",
        }),
        { params: { x: 100, y: 100 } },
    ),
    state(
        "current",
        style({
            opacity: 1,
            filter: "blur(0px)",
            transform: "scale(1) translate({{x}}px, {{y}}px)",
        }),
        { params: { x: 0, y: 0 } },
    ),
    state(
        "behind",
        style({
            opacity: 0.6,
            filter: "blur(5px)",
            transform: "scale(0.95) translate({{x}}px, {{y}}px)",
        }),
        { params: { x: -30, y: -30 } },
    ),
    state(
        "far",
        style({
            opacity: 0.6,
            filter: "blur(5px)",
            transform: "scale(0.9) translate({{x}}px, {{y}}px)",
        }),
        { params: { x: -60, y: -60 } },
    ),
    transition(":enter", [animate("0.3s ease-in-out")]),
    transition(":leave", [animate("0.5s ease-in-out")]),
    transition("* <=> *", [animate("0.7s ease-in-out")]),
]);
