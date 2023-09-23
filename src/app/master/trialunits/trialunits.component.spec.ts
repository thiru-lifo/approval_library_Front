import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialunitsComponent } from './trialunits.component';

describe('TrialunitsComponent', () => {
  let component: TrialunitsComponent;
  let fixture: ComponentFixture<TrialunitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialunitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialunitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
