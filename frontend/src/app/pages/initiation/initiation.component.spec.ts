import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiationComponent } from './initiation.component';

describe('InitiationComponent', () => {
  let component: InitiationComponent;
  let fixture: ComponentFixture<InitiationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitiationComponent]
    });
    fixture = TestBed.createComponent(InitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
