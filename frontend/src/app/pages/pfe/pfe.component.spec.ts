import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PFEComponent } from './pfe.component';

describe('PFEComponent', () => {
  let component: PFEComponent;
  let fixture: ComponentFixture<PFEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PFEComponent]
    });
    fixture = TestBed.createComponent(PFEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
