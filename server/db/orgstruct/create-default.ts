import { IDivision } from "@domain";
import { DBEntry } from "@utils";

export function createDefault(): DBEntry<IDivision>[] {
    // We need 7 divisions
    const divisionNames = ["Administrative", "HR", "Marketing", "Finance", "Tech", "QA", "PR"];
    const defaultProduct = "TBD";

    return divisionNames.map((name) => ({
        title: name,
        id: Date.now(),
        product: defaultProduct,
        offices: [],
        type: "division",
    }));
}
