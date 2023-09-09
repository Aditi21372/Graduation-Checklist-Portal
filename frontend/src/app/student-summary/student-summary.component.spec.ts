import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSummaryComponent } from './student-summary.component';

describe('StudentSummaryComponent', () => {
  let component: StudentSummaryComponent;
  let fixture: ComponentFixture<StudentSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentSummaryComponent]
    });
    fixture = TestBed.createComponent(StudentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
