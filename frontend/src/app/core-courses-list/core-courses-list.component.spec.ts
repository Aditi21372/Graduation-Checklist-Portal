import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { CoreCoursesListComponent } from './core-courses-list.component';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject } from 'rxjs';

describe('CoreCoursesListComponent', () => {
  let component: CoreCoursesListComponent;
  let fixture: ComponentFixture<CoreCoursesListComponent>;
  let activatedRoute: ActivatedRoute;
  let router: Router;

  // Use BehaviorSubject for queryParams
  const queryParamsSubject = new BehaviorSubject<any>({});

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoreCoursesListComponent],
      imports: [MatTableModule, MatCardModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParamsSubject.asObservable(),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(CoreCoursesListComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate core courses and bucket courses correctly', () => {
    const mockCoreCourseData = [
      { course: 'Course1', semester: 1, status: 'Completed', credits: 3, grade: 'A' },
    ];

    const mockBucketCourseData = [
      [
        { course: 'Course2', semester: 2, status: 'In Progress', credits: 4, grade: 'B' },
      ],
    ];

    const mockCompletedBuckets = [
      { bucket: 'Bucket1', status: 'Completed' },
      { bucket: 'Bucket2', status: 'In Progress' },
    ];

    // Set the queryParams using next method of BehaviorSubject
    queryParamsSubject.next({
      rollNumber: 123,
      studentName: 'Test Student',
      program: 'Test Program',
      branch: 'Test Branch',
      coreCourseData: JSON.stringify(mockCoreCourseData),
      bucketCourseData: JSON.stringify(mockBucketCourseData),
      completedBuckets: JSON.stringify(mockCompletedBuckets),
    });

    // Trigger ngOnInit
    component.ngOnInit();
    expect(component.tablesData[0].data).toEqual([
      { course: 'Course2', semester: 2, status: 'In Progress', credits: 4, grade: 'B' },
    ]);
  });

  it('should navigate back to dashboard on goBack()', () => {
    const routerSpy = spyOn(router, 'navigate');

    // Set rollNumber
    component.rollNumber = 123;

    // Trigger goBack
    component.goBack();

    // Check if navigate function is called with the correct arguments
    expect(routerSpy).toHaveBeenCalledWith(['/dashboard', component.rollNumber]);
  });

  // Add more tests as needed
});
