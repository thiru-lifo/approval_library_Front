import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupValueComponent } from './lookup-value.component';

describe('LookupValueComponent', () => {
  let component: LookupValueComponent;
  let fixture: ComponentFixture<LookupValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
