import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeCommandsCatalogComponent } from './code-commands-catalog.component';

describe('CodeCommandsCatalogComponent', () => {
  let component: CodeCommandsCatalogComponent;
  let fixture: ComponentFixture<CodeCommandsCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeCommandsCatalogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeCommandsCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
