import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleComponentsAttributeComponent } from './module-components-attribute.component';

describe('ModuleComponentsAttributeComponent', () => {
  let component: ModuleComponentsAttributeComponent;
  let fixture: ComponentFixture<ModuleComponentsAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleComponentsAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleComponentsAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
