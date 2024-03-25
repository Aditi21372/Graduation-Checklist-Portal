import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsSummaryComponent } from './students-summary.component';

describe('StudentsSummaryComponent', () => {
  let component: StudentsSummaryComponent;
  let fixture: ComponentFixture<StudentsSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentsSummaryComponent]
    });
    fixture = TestBed.createComponent(StudentsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
