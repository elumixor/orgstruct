import { Directive, Input, TemplateRef, ViewContainerRef, inject, type OnInit } from "@angular/core";

export class ListForOfContext<T> {
    constructor(
        readonly $implicit: T,
        readonly index: number,
    ) {}
}

@Directive({
    selector: "[appListFor][appListForOf]",
    standalone: true,
})
export class ListForOfDirective<T> implements OnInit {
    private readonly viewContainer = inject(ViewContainerRef);
    private readonly template = inject(TemplateRef<ListForOfContext<T>>);

    private elements?: T[];

    @Input() appListForEmpty?: TemplateRef<unknown>;

    @Input() set appListForOf(elements: T[] | undefined) {
        this.elements = elements;

        // todo: add a check for a change?
        this.update();
    }

    ngOnInit() {
        this.update();
    }

    private update() {
        this.viewContainer.clear();
        if (this.elements?.nonEmpty) this.renderElements(this.elements);
        else this.renderTemplate();
    }

    private renderElements(elements: T[]) {
        for (const [index, element] of elements.entries())
            this.viewContainer.createEmbeddedView(this.template, new ListForOfContext(element, index));
    }

    private renderTemplate() {
        if (this.appListForEmpty) this.viewContainer.createEmbeddedView(this.appListForEmpty);
    }

    static ngTemplateContextGuard<T>(_directive: ListForOfDirective<T>, ctx: unknown): ctx is ListForOfContext<T> {
        return true;
    }
}

// Also export the `LazyForOfDirective` class as `LazyForDirective` to improve the DX for
// cases when the directive is used as standalone, so the class name
// matches the CSS selector (*ngFor).
export { ListForOfDirective as ListForDirective };
