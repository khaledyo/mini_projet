import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfectionementComponent } from './perfectionement.component';

describe('PerfectionementComponent', () => {
  let component: PerfectionementComponent;
  let fixture: ComponentFixture<PerfectionementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfectionementComponent]
    });
    fixture = TestBed.createComponent(PerfectionementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
