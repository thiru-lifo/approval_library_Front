import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMtuComponent } from './login-mtu.component';

describe('LoginMtuComponent', () => {
  let component: LoginMtuComponent;
  let fixture: ComponentFixture<LoginMtuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginMtuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMtuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
