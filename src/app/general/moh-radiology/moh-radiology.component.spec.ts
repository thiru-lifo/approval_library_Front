import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MohRadiologyComponent } from './moh-radiology.component';

describe('MohRadiologyComponent', () => {
  let component: MohRadiologyComponent;
  let fixture: ComponentFixture<MohRadiologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MohRadiologyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MohRadiologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
