import type { Routes } from "@angular/router";
import { OrgstructComponent, ProcessesComponent } from "./pages";

export const routes: Routes = [
    { path: "orgstruct", component: OrgstructComponent },
    { path: "processes", component: ProcessesComponent },
    // { path: "", redirectTo: "/orgstruct", pathMatch: "full" },
    { path: "", redirectTo: "/processes", pathMatch: "full" },
];
