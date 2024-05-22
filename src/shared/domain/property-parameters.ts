import type { PropertyType } from "./property-types";
import type { ITag } from "./tag";

export type ITextPropertyParameters = Record<string, never>;
export type IRelationPropertyParameters = Record<string, never>;
export interface ITagPropertyParameters {
    multiple: boolean;
    values: Record<number, ITag>;
}

interface IPropertyParametersMap {
    text: ITextPropertyParameters;
    relation: IRelationPropertyParameters;
    tag: ITagPropertyParameters;
}

export type PropertyParameters<T extends PropertyType = PropertyType> = IPropertyParametersMap[T];
