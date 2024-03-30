import type { Type } from "@angular/core";

export type Flavor = "default" | "danger" | "warning";
export type Action = () => void | PromiseLike<void>;

export interface IBaseContextMenuOption {
    title: string;
    description?: string;
    icon?: string;
    flavor?: Flavor;
    shortcut?: string;
}

export interface ContextMenuOptionAction extends IBaseContextMenuOption {
    action: Action;
}
export interface ContextMenuOptionNested extends IBaseContextMenuOption {
    nested: ContextOptions;
}
export interface ContextMenuOptionComponent extends IBaseContextMenuOption {
    component: Type<unknown>;
}

export type ContextMenuOption = ContextMenuOptionAction | ContextMenuOptionNested | ContextMenuOptionComponent;

export class ContextOptions {
    options: ContextMenuOption[] = [];
    with(title: string, action: Action, options?: Omit<IBaseContextMenuOption, "title">) {
        this.options.push({ title, action, ...options });
        return this;
    }

    withDanger(title: string, action: Action, options?: Omit<IBaseContextMenuOption, "title" | "flavor">) {
        return this.with(title, action, { flavor: "danger", ...options });
    }

    withWarning(title: string, action: Action, options?: Omit<IBaseContextMenuOption, "title" | "flavor">) {
        return this.with(title, action, { flavor: "warning", ...options });
    }

    withNested(title: string, nested: ContextOptions, options?: Omit<IBaseContextMenuOption, "title">) {
        this.options.push({ title, nested, ...options });
        return this;
    }

    withComponent(title: string, component: Type<unknown>, options?: Omit<IBaseContextMenuOption, "title">) {
        this.options.push({ title, component, ...options });
        return this;
    }
}
