import { IOffice, ItemObject, ItemType } from "@domain";
import { DBEntry } from "@utils";

export function create<T extends ItemType>(
    kind: T,
    params: Record<string, unknown>,
    database: DBEntry<ItemObject>[]
): DBEntry<ItemObject<T>> {
    type R<T extends ItemType = ItemType> = DBEntry<ItemObject<T>>;

    // Get a unique ID for it
    const id = Date.now();
    const result = { id, type: kind } as R<T>;

    if (kind === "task") (result as R<"task">).title = "New Task";
    else if (kind === "person") (result as R<"person">).name = "New Person";
    else if (kind === "position") (result as R<"position">).title = "New Position";
    else if (kind === "office") {
        const office = result as R<"office">;
        office.title = "New Office";
        office.division = (params as { divisionId: number }).divisionId;
        // Add the office to the division
        const division = database.find((item) => item.id === office.division) as R<"division"> | undefined;
        division?.offices.push(id);
    } else (result as R<"other">).title = "New Item";

    return result;
}

export function createOffice(divisionId: number): DBEntry<IOffice> {
    return {
        title: "New Office",
        id: Date.now(),
        division: divisionId,
        type: "office",
        product: "TBD",
        branches: [],
    };
}
