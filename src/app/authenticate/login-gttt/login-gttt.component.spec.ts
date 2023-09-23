import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginGtttComponent } from './login-gttt.component';

describe('LoginGtttComponent', () => {
  let component: LoginGtttComponent;
  let fixture: ComponentFixture<LoginGtttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginGtttComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginGtttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
