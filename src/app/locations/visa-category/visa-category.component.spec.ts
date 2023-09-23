import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaCategoryComponent } from './visa-category.component';

describe('VisaCategoryComponent', () => {
  let component: VisaCategoryComponent;
  let fixture: ComponentFixture<VisaCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisaCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
