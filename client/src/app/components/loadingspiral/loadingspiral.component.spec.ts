import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingspiralComponent } from './loadingspiral.component';

describe('LoadingspiralComponent', () => {
  let component: LoadingspiralComponent;
  let fixture: ComponentFixture<LoadingspiralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingspiralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingspiralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
