import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStudentGradeComponent } from './update-student-grade.component';

describe('UpdateStudentGradeComponent', () => {
  let component: UpdateStudentGradeComponent;
  let fixture: ComponentFixture<UpdateStudentGradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateStudentGradeComponent]
    });
    fixture = TestBed.createComponent(UpdateStudentGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
