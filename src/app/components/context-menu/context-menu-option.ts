export interface IContextMenuOption {
    text: string;
    description?: string;
    icon?: string;
    flavor?: "default" | "danger" | "warning";
    action: () => void | PromiseLike<void>;
}
