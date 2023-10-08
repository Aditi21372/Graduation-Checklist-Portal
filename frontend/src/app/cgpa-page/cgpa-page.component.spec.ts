import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpaPageComponent } from './cgpa-page.component';

describe('CgpaPageComponent', () => {
  let component: CgpaPageComponent;
  let fixture: ComponentFixture<CgpaPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CgpaPageComponent]
    });
    fixture = TestBed.createComponent(CgpaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
