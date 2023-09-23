import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VechiclePassComponent } from './vechicle-pass.component';

describe('VechiclePassComponent', () => {
  let component: VechiclePassComponent;
  let fixture: ComponentFixture<VechiclePassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VechiclePassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VechiclePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
