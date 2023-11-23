import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { StudentServiceService } from '../student-service.service';
import { StudentInfoComponent } from './student-info.component';
import { MatCardModule } from '@angular/material/card';

describe('StudentInfoComponent', () => {
  let component: StudentInfoComponent;
  let fixture: ComponentFixture<StudentInfoComponent>;
  let studentService: jasmine.SpyObj<StudentServiceService>;

  beforeEach(() => {
    studentService = jasmine.createSpyObj('StudentServiceService', [
      'getStudentData',
      'getGraduationStatus',
    ]);

    TestBed.configureTestingModule({
      declarations: [StudentInfoComponent],
      imports: [MatCardModule],
      providers: [
        { provide: StudentServiceService, useValue: studentService },
      ],
    });
    fixture = TestBed.createComponent(StudentInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
