import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgstructComponent } from './orgstruct.component';

describe('OrgstructComponent', () => {
  let component: OrgstructComponent;
  let fixture: ComponentFixture<OrgstructComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgstructComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrgstructComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
