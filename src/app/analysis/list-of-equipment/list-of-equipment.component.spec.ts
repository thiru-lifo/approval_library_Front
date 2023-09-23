import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfEquipmentComponent } from './list-of-equipment.component';

describe('ListOfEquipmentComponent', () => {
  let component: ListOfEquipmentComponent;
  let fixture: ComponentFixture<ListOfEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfEquipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
