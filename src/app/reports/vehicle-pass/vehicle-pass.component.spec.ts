import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePassComponent } from './vehicle-pass.component';

describe('VehiclePassComponent', () => {
  let component: VehiclePassComponent;
  let fixture: ComponentFixture<VehiclePassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiclePassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
