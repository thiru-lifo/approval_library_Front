import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnlaysiHomeComponent } from './anlaysi-home.component';

describe('AnlaysiHomeComponent', () => {
  let component: AnlaysiHomeComponent;
  let fixture: ComponentFixture<AnlaysiHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnlaysiHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnlaysiHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
