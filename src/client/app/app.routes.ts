import type { Routes } from "@angular/router";
import { MainPageComponent } from "./pages";

export const routes: Routes = [
    {
        path: "tasks",
        component: MainPageComponent,
    },
    {
        path: "**",
        redirectTo: "tasks",
        pathMatch: "full",
    },
];
