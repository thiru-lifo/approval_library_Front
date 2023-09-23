import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityPinComponent } from './security-pin.component';

describe('SecurityPinComponent', () => {
  let component: SecurityPinComponent;
  let fixture: ComponentFixture<SecurityPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityPinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
