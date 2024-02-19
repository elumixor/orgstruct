import { Directive, Input, TemplateRef, ViewContainerRef, inject, type OnInit, EmbeddedViewRef } from "@angular/core";
import type { EntityName, Identifier } from "@domain";
import { NetworkService } from "@services";
import { all, type MetaPlain } from "@utils";

export class LazyForOfContext<T extends EntityName> {
    constructor(
        readonly $implicit: MetaPlain<T>,
        readonly index: number,
    ) {}
}

@Directive({
    selector: "[appLazyFor][appLazyForOf]",
    standalone: true,
})
export class LazyForOfDirective<T extends EntityName> implements OnInit {
    private readonly viewContainer = inject(ViewContainerRef);
    private readonly template = inject(TemplateRef<LazyForOfContext<T>>);
    private readonly network = inject(NetworkService);

    private ids?: Identifier[];
    private items?: MetaPlain<T>[];
    private type?: T;
    private currentViews = new Map<string, EmbeddedViewRef<unknown>>();

    @Input() appLazyForLoading?: TemplateRef<unknown>;
    @Input() appLazyForLoadingSingle?: TemplateRef<unknown>;

    @Input() set appLazyForType(value: T) {
        this.type = value;
        if (this.ids) void this.update(value, this.ids);
    }
    @Input() set appLazyForOf(ids: Identifier[] | undefined) {
        this.ids = ids;
        if (this.type && ids) void this.update(this.type, ids);
    }

    ngOnInit() {
        this.render();
    }

    private async update(type: T, ids: Identifier[]) {
        const oldItems = (this.items ?? []).filter((item) => ids.some((id) => id.id === item.id));
        const newIds = ids.filter((id) => !oldItems.some((item) => item.id === id.id));
        const newItems = await all(...newIds.map((id) => this.network.get(type, id)));
        this.items = [...oldItems, ...newItems];
        this.render();
    }

    private render() {
        if (this.items) {
            this.renderItems(this.items);
            return;
        }

        if (this.ids && this.appLazyForLoadingSingle) {
            this.renderIndividualLoading(this.ids, this.appLazyForLoadingSingle);
            return;
        }

        if (this.appLazyForLoading) this.renderAllLoading(this.appLazyForLoading);
    }

    private renderItems(items: MetaPlain<T>[]) {
        for (const [index, item] of items.entries()) {
            const view =
                this.currentViews.get(item.id) ??
                this.viewContainer.createEmbeddedView(this.template, new LazyForOfContext<T>(item, index));

            this.viewContainer.insert(view);
            this.currentViews.set(item.id, view);
        }

        for (const [id, view] of this.currentViews) {
            if (items.some((item) => item.id === id)) continue;

            this.viewContainer.remove(this.viewContainer.indexOf(view));
            this.currentViews.delete(id);
        }
    }

    private renderIndividualLoading(ids: Identifier[], individualLoading: TemplateRef<unknown>) {
        this.viewContainer.clear();
        for (const id of ids) this.viewContainer.createEmbeddedView(individualLoading, { id });
    }

    private renderAllLoading(allLoading: TemplateRef<unknown>) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(allLoading);
    }

    static ngTemplateContextGuard<T extends EntityName>(
        _directive: LazyForOfDirective<T>,
        ctx: unknown,
    ): ctx is LazyForOfContext<T> {
        return true;
    }
}

// Also export the `LazyForOfDirective` class as `LazyForDirective` to improve the DX for
// cases when the directive is used as standalone, so the class name
// matches the CSS selector (*ngFor).
export { LazyForOfDirective as LazyForDirective };
