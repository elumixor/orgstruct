export interface IContextMenuOption {
    text: string;
    description?: string;
    icon?: string;
    action: () => void;
}
