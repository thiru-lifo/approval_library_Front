import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDtttComponent } from './login-dttt.component';

describe('LoginDtttComponent', () => {
  let component: LoginDtttComponent;
  let fixture: ComponentFixture<LoginDtttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginDtttComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDtttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
