import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpmComponent } from './cbpm.component';

describe('CbpmComponent', () => {
  let component: CbpmComponent;
  let fixture: ComponentFixture<CbpmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbpmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
