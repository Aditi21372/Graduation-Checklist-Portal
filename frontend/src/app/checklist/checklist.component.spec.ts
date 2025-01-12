import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { StudentServiceService } from '../student-service.service';
import { ChecklistComponent } from './checklist.component';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

describe('ChecklistComponent', () => {
  let component: ChecklistComponent;
  let fixture: ComponentFixture<ChecklistComponent>;
  let studentService: jasmine.SpyObj<StudentServiceService>;

  beforeEach(() => {
    studentService = jasmine.createSpyObj('StudentServiceService', [
      'getStudentData',
      'getMandatoryCourses',
      'getBucketCourses',
      'getSSHcourses',
      'getCWcourses',
      'getSGcourses',
      'getBTPCredits',
      'getTwoXXCredits',
      'getIPCredits',
      'getOnlineCourseCredits',
      'get32Credits',
      'getIncompleteGrade',
    ]);

    TestBed.configureTestingModule({
      declarations: [ChecklistComponent],
      imports: [MatCardModule, MatTableModule],
      providers: [
        { provide: StudentServiceService, useValue: studentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChecklistComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});