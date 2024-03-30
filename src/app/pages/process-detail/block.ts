export interface IBlock {
    id: string;
    x: number;
    y: number;
    title: string;
    description?: string;
}

export interface IConnector {
    kind: "output" | "event";
    fromBlockId: string;
    toBlockId: string;
    title?: string;
}

export interface IAreaVertical {
    isVertical: true;
    x: number;
    width: number;
    title: string;
}

export interface IAreaHorizontal {
    isVertical: false;
    y: number;
    height: number;
    title: string;
}

export type IArea = IAreaVertical | IAreaHorizontal;
