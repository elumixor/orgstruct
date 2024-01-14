import { IContacts } from "./contacts";
import { IPosition } from "./position";

export interface IPerson {
    name: string;
    position?: IPosition;
    contacts?: IContacts;
}
