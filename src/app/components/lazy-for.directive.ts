import {
    Component,
    ComponentRef,
    Directive,
    Input,
    TemplateRef,
    ViewContainerRef,
    effect,
    inject,
    type OnInit,
} from "@angular/core";
import type { EntityName } from "@domain";
import type { Lazy } from "@services";
import type { MetaPlain } from "@domain";

export class LazyForOfContext<T extends EntityName> {
    constructor(
        readonly $implicit: MetaPlain<T>,
        readonly proxy: Lazy<T>,
        readonly index: number,
    ) {}
}

@Component({ template: "" })
export class ProxyComponent<T extends EntityName> {
    private readonly viewContainer = inject(ViewContainerRef);

    @Input({ required: true }) proxy!: Lazy<T>;
    @Input({ required: true }) index!: number;
    @Input({ required: true }) template!: TemplateRef<LazyForOfContext<T>>;
    @Input({ required: true }) loadingTemplate!: TemplateRef<unknown>;

    constructor() {
        effect(() => this.render());
    }

    private render() {
        const currentValue = this.proxy();
        if (!currentValue) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.loadingTemplate);
            return;
        }

        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(
            this.template,
            new LazyForOfContext(currentValue, this.proxy, this.index),
        );
    }
}

@Directive({
    selector: "[appLazyFor][appLazyForOf]",
    standalone: true,
})
export class LazyForOfDirective<T extends EntityName> implements OnInit {
    private readonly viewContainer = inject(ViewContainerRef);
    private readonly template = inject(TemplateRef<LazyForOfContext<T>>);

    private proxies?: Lazy<T>[];
    private type?: T;
    private currentViews: ComponentRef<ProxyComponent<T>>[] = [];
    private isFirstLoad = true;

    @Input() appLazyForLoading?: TemplateRef<unknown>;
    @Input() appLazyForLoadingSingle?: TemplateRef<unknown>;

    @Input() set appLazyForType(value: T) {
        this.type = value;
        if (this.proxies) this.update();
    }
    @Input() set appLazyForOf(ids: Lazy<T>[] | undefined) {
        this.proxies = ids;
        if (this.type && ids) this.update();
    }

    ngOnInit() {
        this.update();
    }

    private update() {
        if (!this.proxies || !this.type) {
            this.viewContainer.clear();
            if (this.appLazyForLoading) this.viewContainer.createEmbeddedView(this.appLazyForLoading);
            return;
        }

        // We need to remove the remaining loading template
        if (this.isFirstLoad) {
            this.isFirstLoad = false;
            this.viewContainer.clear();
        }

        // Remove all the components that have a different proxy
        const outdated = this.currentViews.filter(
            (proxyComponent) => !this.proxies?.some((proxy) => proxy === proxyComponent.instance.proxy),
        );

        for (const proxyComponent of outdated) {
            proxyComponent.destroy();
            this.currentViews.remove(proxyComponent);
        }

        // Add the new proxies
        const newProxies = this.proxies.filter(
            (proxy) => !this.currentViews.some((proxyComponent) => proxyComponent.instance.proxy === proxy),
        );

        let lastIndex = this.currentViews.length;
        for (const proxy of newProxies) {
            this.currentViews.push(this.createProxyComponent(proxy, lastIndex));
            lastIndex++;
        }

        // Update the current views with the new context
        for (let i = 0; i < this.currentViews.length; i++) this.currentViews[i].setInput("index", i);
    }

    private createProxyComponent(proxy: Lazy<T>, index: number) {
        const proxyRef = this.viewContainer.createComponent(ProxyComponent<T>);
        proxyRef.setInput("proxy", proxy);
        proxyRef.setInput("template", this.template);
        proxyRef.setInput("index", index);
        proxyRef.setInput("loadingTemplate", this.appLazyForLoadingSingle);
        return proxyRef;
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
