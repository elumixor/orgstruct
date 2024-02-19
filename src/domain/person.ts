import type { IContacts } from "./contacts";
import type { IPosition } from "./position";

export interface IPerson {
    name: string;
    position?: IPosition;
    contacts?: IContacts;
}
