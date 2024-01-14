import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWithTextComponent } from './image-with-text.component';

describe('ImageWithTextComponent', () => {
  let component: ImageWithTextComponent;
  let fixture: ComponentFixture<ImageWithTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageWithTextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageWithTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
