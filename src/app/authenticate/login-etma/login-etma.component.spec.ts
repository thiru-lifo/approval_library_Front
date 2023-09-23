import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEtmaComponent } from './login-etma.component';

describe('LoginEtmaComponent', () => {
  let component: LoginEtmaComponent;
  let fixture: ComponentFixture<LoginEtmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginEtmaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEtmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
