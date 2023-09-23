import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleComponentsComponent } from './module-components.component';

describe('ModuleComponentsComponent', () => {
  let component: ModuleComponentsComponent;
  let fixture: ComponentFixture<ModuleComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
