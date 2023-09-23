import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMComponent } from './form-m.component';

describe('FormMComponent', () => {
  let component: FormMComponent;
  let fixture: ComponentFixture<FormMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
