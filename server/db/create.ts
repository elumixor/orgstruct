import { IDivision, IOffice, ItemObject, ItemType } from "@domain";
import { DBEntry } from "@utils";

type R<T extends ItemType = ItemType> = DBEntry<ItemObject<T>>;

export function create<T extends ItemType>(
    type: T,
    params: Record<string, unknown>,
    database: DBEntry<ItemObject>[],
): DBEntry<ItemObject<T>> {
    type RT = R<T>;
    // Get a unique ID for it
    const id = Date.now();
    function created<T extends ItemType>(item: Omit<R<T>, "id" | "type">) {
        return { id, type, ...item } as RT;
    }

    if (type === "task") return created<"task">({ title: "New Task" });
    if (type === "person") return created<"person">({ name: "New Person" });
    if (type === "position") return created<"position">({ title: "New Position" });
    if (type === "division") return created<"division">({ title: "New Division", offices: [], product: "TBD" });
    if (type === "office") {
        const { divisionId: division } = params as { divisionId: number };
        const office = created<"office">({
            title: "New Office",
            division,
            product: "TBD",
            branches: [],
        });

        // Add the office to the division
        (database.find((item) => item.id === division) as DBEntry<IDivision>)?.offices.push(id);

        // Return the office
        return office;
    }
    if (type === "branch") {
        const { officeId: office } = params as { officeId: number };
        const branch = created<"branch">({ title: "New Branch", office, tasks: [], product: "TBD" });

        // Add the branch to the office
        (database.find((item) => item.id === office) as DBEntry<IOffice>)?.branches.push(id);

        // Return the branch
        return branch;
    }

    return created<"other">({ title: "New Item" });
}
