import { Component } from "@angular/core";

@Component({
    selector: "app-background",
    standalone: true,
    imports: [],
    template: "",
    styles: [
        `
            :host {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                // background-image: linear-gradient(135deg, #bdc4e7 0%, #b6a5c4 100%);
                z-index: -100;

                overflow: hidden;

                &::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    // background-image: radial-gradient(rgb(0 0 0 / 10%) 1px, transparent 0);
                    background-size: 15px 15px;

                    // animation: gradientAnimation 3s linear infinite;

                    @keyframes gradientAnimation {
                        0% {
                            background-position: 0px 0px;
                        }
                        100% {
                            background-position: -60px -60px;
                        }
                    }
                }
            }
        `,
    ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class BackgroundComponent {}
