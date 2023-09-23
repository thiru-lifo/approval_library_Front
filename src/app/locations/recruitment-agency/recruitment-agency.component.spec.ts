import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentAgencyComponent } from './recruitment-agency.component';

describe('RecruitmentAgencyComponent', () => {
  let component: RecruitmentAgencyComponent;
  let fixture: ComponentFixture<RecruitmentAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentAgencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
