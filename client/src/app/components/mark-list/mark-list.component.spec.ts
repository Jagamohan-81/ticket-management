import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkListComponent } from './mark-list.component';

describe('MarkListComponent', () => {
  let component: MarkListComponent;
  let fixture: ComponentFixture<MarkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
