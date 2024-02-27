export interface IContextMenuOption {
    text: string;
    description?: string;
    icon?: string;
    flavor?: "default" | "danger" | "warning";
    action: () => unknown;
}

export class ContextMenuOptionsBuilder {
    constructor(private options: IContextMenuOption[]) {}

    // conditional<T>() {}

    build() {
        return this.options;
    }
}

export function contextOptions(initialOptions?: IContextMenuOption[]) {
    return new ContextMenuOptionsBuilder(initialOptions ?? []);
}
