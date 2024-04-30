import { CurrencyPipe, JsonPipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { appear } from "@animations";
import type { IEntity } from "@domain";
import { NetworkService } from "@services";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { ChipsModule } from "primeng/chips";
import { ColorPickerModule } from "primeng/colorpicker";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ListboxModule } from "primeng/listbox";
import { MultiSelectModule } from "primeng/multiselect";
import { SelectButtonModule } from "primeng/selectbutton";
import { TreeSelectModule } from "primeng/treeselect";
import { TagModule } from "primeng/tag";
import { DragDropModule } from "primeng/dragdrop";
import { TableModule } from "primeng/table";

interface Product {
    id: string;
    name: string;
}

@Component({
    selector: "app-example-page",
    standalone: true,
    imports: [
        ButtonModule,
        CheckboxModule,
        FormsModule,
        ChipsModule,
        ColorPickerModule,
        IconFieldModule,
        InputIconModule,
        InputSwitchModule,
        InputTextareaModule,
        ListboxModule,
        MultiSelectModule,
        SelectButtonModule,
        TreeSelectModule,
        JsonPipe,
        TagModule,
        DragDropModule,
        TableModule,
        CurrencyPipe,
    ],
    templateUrl: "./example-page.component.html",
    styleUrl: "./example-page.component.scss",
    animations: [appear("appear")],
})
export class ExamplePageComponent {
    private readonly network = inject(NetworkService);
    readonly data = signal(undefined as string | undefined);
    constructor() {
        void this.network.post<IEntity>("echo", { data: "Hello world!" }).then((entity) => this.data.set(entity.data));
    }

    checked = false;
    readonly values = [] as string[];
    readonly separatorExp = /,| /;
    color = "#1976D2";
    longText = "I am wrapped multiple times because I can grow automatically!";

    readonly cities = [
        { label: "Rome", value: "Rome" },
        { label: "Istanbul", value: "Istanbul" },
        { label: "Berlin", value: "Berlin" },
        { label: "Paris", value: "Paris" },
    ];

    city?: string;

    paymentOptions = [
        {
            label: "Option 1",
            value: "first",
        },
        {
            label: "Option 2",
            value: "second",
        },
        {
            label: "Option 3",
            value: "third",
        },
    ];

    paymentOption?: string;

    justifyOptions = [
        {
            icon: "pi pi-align-left",
            value: "left",
        },
        {
            icon: "pi pi-align-right",
            value: "right",
        },
        {
            icon: "pi pi-align-center",
            value: "center",
        },
        {
            icon: "pi pi-align-justify",
            value: "justify",
        },
    ];
    justify = this.justifyOptions[0];

    readonly nodes = [
        {
            key: "0",
            label: "Documents",
            data: "Documents Folder",
            icon: "pi pi-fw pi-inbox",
            children: [
                {
                    key: "0-0",
                    label: "Work",
                    data: "Work Folder",
                    icon: "pi pi-fw pi-cog",
                    children: [
                        { key: "0-0-0", label: "Expenses.doc", icon: "pi pi-fw pi-file", data: "Expenses Document" },
                        { key: "0-0-1", label: "Resume.doc", icon: "pi pi-fw pi-file", data: "Resume Document" },
                    ],
                },
                {
                    key: "0-1",
                    label: "Home",
                    data: "Home Folder",
                    icon: "pi pi-fw pi-home",
                    children: [
                        {
                            key: "0-1-0",
                            label: "Invoices.txt",
                            icon: "pi pi-fw pi-file",
                            data: "Invoices for this month",
                        },
                    ],
                },
            ],
        },
        {
            key: "1",
            label: "Events",
            data: "Events Folder",
            icon: "pi pi-fw pi-calendar",
            children: [
                { key: "1-0", label: "Meeting", icon: "pi pi-fw pi-calendar-plus", data: "Meeting" },
                { key: "1-1", label: "Product Launch", icon: "pi pi-fw pi-calendar-plus", data: "Product Launch" },
                { key: "1-2", label: "Report Review", icon: "pi pi-fw pi-calendar-plus", data: "Report Review" },
            ],
        },
        {
            key: "2",
            label: "Movies",
            data: "Movies Folder",
            icon: "pi pi-fw pi-star-fill",
            children: [
                {
                    key: "2-0",
                    icon: "pi pi-fw pi-star-fill",
                    label: "Al Pacino",
                    data: "Pacino Movies",
                    children: [
                        { key: "2-0-0", label: "Scarface", icon: "pi pi-fw pi-video", data: "Scarface Movie" },
                        { key: "2-0-1", label: "Serpico", icon: "pi pi-fw pi-video", data: "Serpico Movie" },
                    ],
                },
                {
                    key: "2-1",
                    label: "Robert De Niro",
                    icon: "pi pi-fw pi-star-fill",
                    data: "De Niro Movies",
                    children: [
                        { key: "2-1-0", label: "Goodfellas", icon: "pi pi-fw pi-video", data: "Goodfellas Movie" },
                        { key: "2-1-1", label: "Untouchables", icon: "pi pi-fw pi-video", data: "Untouchables Movie" },
                    ],
                },
            ],
        },
    ];
    selectedNodes?: unknown;

    availableProducts = [
        { id: "1", name: "Black Watch" },
        { id: "2", name: "Bamboo Watch" },
    ];

    selectedProducts = [] as Product[];

    draggedProduct?: { from: Product[]; product: Product };

    dragStart(from: Product[], product: Product) {
        this.draggedProduct = { from, product };
    }

    drop(to: Product[]) {
        if (!this.draggedProduct) return;
        if (this.draggedProduct.from === to) return;

        this.draggedProduct.from.splice(this.draggedProduct.from.indexOf(this.draggedProduct.product), 1);
        to.push(this.draggedProduct.product);
    }

    dragEnd() {
        this.draggedProduct = undefined;
    }

    getSeverity(status: string) {
        switch (status) {
            case "INSTOCK":
                return "success";
            case "LOWSTOCK":
                return "warning";
            case "OUTOFSTOCK":
                return "danger";
        }
        throw new Error(`Unknown status: ${status}`);
    }

    getStatusSeverity(status: string) {
        switch (status) {
            case "PENDING":
                return "warning";
            case "DELIVERED":
                return "success";
            case "CANCELLED":
                return "danger";
        }
        throw new Error(`Unknown status: ${status}`);
    }

    readonly products = [
        {
            id: "1000",
            code: "f230fh0g3",
            name: "Bamboo Watch",
            description: "Product Description",
            image: "bamboo-watch.jpg",
            price: 65,
            category: "Accessories",
            quantity: 24,
            inventoryStatus: "INSTOCK",
            rating: 5,
        },
        {
            id: "1001",
            code: "nvklal433",
            name: "Black Watch",
            description: "Product Description",
            image: "black-watch.jpg",
            price: 72,
            category: "Accessories",
            quantity: 61,
            inventoryStatus: "OUTOFSTOCK",
            rating: 4,
        },
        {
            id: "1002",
            code: "zz21cz3c1",
            name: "Blue Band",
            description: "Product Description",
            image: "blue-band.jpg",
            price: 79,
            category: "Fitness",
            quantity: 2,
            inventoryStatus: "LOWSTOCK",
            rating: 3,
        },
    ];
}
