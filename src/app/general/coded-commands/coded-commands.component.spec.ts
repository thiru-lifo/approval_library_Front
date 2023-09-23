import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodedCommandsComponent } from './coded-commands.component';

describe('CodedCommandsComponent', () => {
  let component: CodedCommandsComponent;
  let fixture: ComponentFixture<CodedCommandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodedCommandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodedCommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
