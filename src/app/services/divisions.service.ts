import { Injectable } from "@angular/core";

const offices = [{ name: "Office A" }, { name: "Office B" }, { name: "Office C" }];

@Injectable({
    providedIn: "root",
})
export class DivisionsService {
    readonly companyName = "Ishta Gaming";
    readonly description = "We create inspiring games that elevate the consciousness of humanity.";

    readonly divisions = [
        {
            fullName: "Administrative",
            firstLetter: "A",
            offices: [...offices],
        },
        {
            fullName: "Construction",
            firstLetter: "C",
            offices: [...offices],
        },
        {
            fullName: "Marketing",
            firstLetter: "M",
            offices: [...offices],
        },
        {
            fullName: "Finance",
            firstLetter: "F",
            offices: [...offices],
        },
        {
            fullName: "Technical",
            firstLetter: "T",
            offices: [...offices],
        },
        {
            fullName: "Quality Assurance",
            firstLetter: "Q",
            offices: [...offices],
        },
        {
            fullName: "Public Relations",
            firstLetter: "P",
            offices: [...offices],
        },
    ];
}
