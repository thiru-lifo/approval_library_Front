import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCbiuComponent } from './login-cbiu.component';

describe('LoginCbiuComponent', () => {
  let component: LoginCbiuComponent;
  let fixture: ComponentFixture<LoginCbiuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginCbiuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCbiuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
