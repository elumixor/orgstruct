import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    ViewContainerRef,
    inject,
    type OnInit,
} from "@angular/core";
import { appear } from "@animations";
import { ClickDirective } from "@components/click.directive";
import { ShortcutComponent } from "../shortcut.component";
import { WithIconComponent } from "../with-icon.component";
import type { ContextOptions, IContextMenuOption } from "./context-menu-option";
import { ContextMenuRootDirective } from "./context-menu-root.directive";

@Component({
    selector: "app-context-menu",
    standalone: true,
    imports: [WithIconComponent, ShortcutComponent, ClickDirective],
    templateUrl: "./context-menu.component.html",
    styleUrl: "./context-menu.component.scss",
    animations: [appear("appear")],
})
export class ContextMenuComponent implements OnInit {
    @Input({ required: true }) options!: ContextOptions;
    @HostBinding("style.left.px") @Input() x = 0;
    @HostBinding("style.top.px") @Input() y = 0;

    @Output() readonly closed = new EventEmitter<void>();

    private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly root = inject(ContextMenuRootDirective);

    onPointerDown(e: PointerEvent) {
        if (e.composedPath().includes(this.element.nativeElement)) return;

        e.preventDefault();
        e.stopPropagation();

        this.closed.emit();
    }

    action(option: IContextMenuOption) {
        option.action();
        this.closed.emit();
    }

    ngOnInit() {
        const container = this.root.elementRef.nativeElement as HTMLElement;
        const us = this.element.nativeElement;
        container.appendChild(us);

        // When we are added in some pointerdown event, this gets propagated and captured by this component
        // We use this hack to only make the destruction available one tick after we are added to the DOM
        setTimeout(() => this.addCallbacks());
    }

    private addCallbacks() {
        document.addEventListener("pointerdown", this.onPointerDown.bind(this));
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.closed.emit();
        });
    }

    static show(options: ContextOptions, viewContainer: ViewContainerRef, x?: number, y?: number) {
        const component = viewContainer.createComponent(ContextMenuComponent);
        const { instance } = component;
        instance.options = options;
        if (x !== undefined) instance.x = x + 5;
        if (y !== undefined) instance.y = y;
        instance.closed.subscribe(() => component.destroy());
    }
}
