import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { CoreCoursesListComponent } from './core-courses-list.component';
import { MatCardModule } from '@angular/material/card';

describe('CoreCoursesListComponent', () => {
  let component: CoreCoursesListComponent;
  let fixture: ComponentFixture<CoreCoursesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoreCoursesListComponent],
      imports: [MatTableModule, MatCardModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: {
              subscribe: (fn: (value: any) => void) =>
                fn({
                  rollNumber: 123,
                  studentName: 'Test Student',
                  program: 'Test Program',
                  branch: 'Test Branch',
                  coreCourseData: '[{"course":"Course1","semester":1,"status":"Completed","credits":3,"grade":"A"}]', // Replace with your test value
                  bucketCourseData: '[{"course":"Course2","semester":2,"status":"In Progress","credits":4,"grade":"B"}]', // Replace with your test value
                  completedBuckets: '[{"bucket":"Bucket1","status":"Completed"},{"bucket":"Bucket2","status":"In Progress"}]', // Replace with your test value
                }),
            },
            snapshot: {
              paramMap: convertToParamMap({
                rollNumber: 123,
                studentName: 'Test Student',
                program: 'Test Program',
                branch: 'Test Branch',
                coreCourseData: '[{"course":"Course1","semester":1,"status":"Completed","credits":3,"grade":"A"}]', // Replace with your test value
                bucketCourseData: '[{"course":"Course2","semester":2,"status":"In Progress","credits":4,"grade":"B"}]', // Replace with your test value
                completedBuckets: '[{"bucket":"Bucket1","status":"Completed"},{"bucket":"Bucket2","status":"In Progress"}]', // Replace with your test value
              }),
            },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(CoreCoursesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
