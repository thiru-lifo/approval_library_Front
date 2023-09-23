import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KmsComponent } from './kms.component';

describe('KmsComponent', () => {
  let component: KmsComponent;
  let fixture: ComponentFixture<KmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
