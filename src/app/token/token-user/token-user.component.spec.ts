import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenUserComponent } from './token-user.component';

describe('TokenUserComponent', () => {
  let component: TokenUserComponent;
  let fixture: ComponentFixture<TokenUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
