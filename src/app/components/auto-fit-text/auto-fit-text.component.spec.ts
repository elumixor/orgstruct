import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoFitTextComponent } from './auto-fit-text.component';

describe('AutoFitTextComponent', () => {
  let component: AutoFitTextComponent;
  let fixture: ComponentFixture<AutoFitTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoFitTextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutoFitTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
