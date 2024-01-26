import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FVPComponent } from "./fvp.component";

describe("FvpComponent", () => {
    let component: FVPComponent;
    let fixture: ComponentFixture<FVPComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FVPComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FVPComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
