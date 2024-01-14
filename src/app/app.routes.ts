import { Routes } from "@angular/router";
import { ItemsComponent, BudgetComponent, OrgstructComponent, PlanComponent } from "./pages";

export const routes: Routes = [
    { path: "items", component: ItemsComponent },
    { path: "orgstruct", component: OrgstructComponent },
    { path: "budget", component: BudgetComponent },
    { path: "plan", component: PlanComponent },
    { path: "", redirectTo: "/orgstruct", pathMatch: "full" },
];
