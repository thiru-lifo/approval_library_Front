import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownkmsComponent } from './dropdownkms.component';

describe('DropdownkmsComponent', () => {
  let component: DropdownkmsComponent;
  let fixture: ComponentFixture<DropdownkmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownkmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownkmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
