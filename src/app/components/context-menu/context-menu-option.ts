export type Flavor = "default" | "danger" | "warning";
export type Action = () => void | PromiseLike<void>;

export interface IContextMenuOption {
    title: string;
    description?: string;
    icon?: string;
    flavor?: Flavor;
    shortcut?: string;
    action: Action;
}

export class ContextOptions {
    options: IContextMenuOption[] = [];
    with(title: string, action: Action, options?: Omit<IContextMenuOption, "title" | "action">) {
        this.options.push({
            title,
            action,
            ...options,
        });

        return this;
    }

    withDanger(title: string, action: Action, options?: Omit<IContextMenuOption, "title" | "action" | "flavor">) {
        return this.with(title, action, { flavor: "danger", ...options });
    }

    withWarning(title: string, action: Action, options?: Omit<IContextMenuOption, "title" | "action" | "flavor">) {
        return this.with(title, action, { flavor: "warning", ...options });
    }

    withNested(title: string, nestedOptions: ContextOptions, options?: Omit<IContextMenuOption, "title" | "action">) {
        console.warn("Not implemented");
        // this.options.push({
        //     title,
        //     action: () => nestedOptions,
        //     ...options,
        // });

        return this;
    }

    withComponent(component: unknown) {
        console.warn("Not implemented");
        return this;
    }
}
