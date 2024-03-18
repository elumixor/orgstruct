import type { Routes } from "@angular/router";
import { OrgstructComponent, ProcessDetailComponent, ProcessesComponent } from "./pages";

export const routes: Routes = [
    { path: "orgstruct", component: OrgstructComponent },
    { path: "processes", component: ProcessesComponent },
    { path: "processes/:id", component: ProcessDetailComponent },
    // { path: "", redirectTo: "/orgstruct", pathMatch: "full" },
    { path: "", redirectTo: "/processes", pathMatch: "full" },
];
