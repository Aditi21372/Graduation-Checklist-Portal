import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { CwDetailsComponent } from './cw-details.component';
import { MatCardModule } from '@angular/material/card';

describe('CwDetailsComponent', () => {
  let component: CwDetailsComponent;
  let fixture: ComponentFixture<CwDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CwDetailsComponent],
      imports: [MatTableModule, MatCardModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: {
              subscribe: (fn: (value: any) => void) =>
                fn({
                  studentName: 'Test Student',
                  program: 'Test Program',
                  rollNumber: 123,
                  branch: 'Test Branch',
                  courseData: '[{"course": "Math", "semester": 1, "status": "Completed", "credits": 3, "grade": "A"}, {"course": "Physics", "semester": 2, "status": "In Progress", "credits": 4, "grade": null}]',
                }),
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(CwDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with queryParams', () => {
    expect(component.studentName).toEqual('Test Student');
    expect(component.program).toEqual('Test Program');
    expect(component.rollNumber).toEqual(123);
    expect(component.branch).toEqual('Test Branch');
    expect(component.courseData).toEqual([
      { course: 'Math', semester: 1, status: 'Completed', credits: 3, grade: 'A' },
      { course: 'Physics', semester: 2, status: 'In Progress', credits: 4, grade: null }
    ]);
    // You can add more assertions based on your specific use case
  });

  it('should navigate back to dashboard on goBack()', () => {
    component.goBack();
    // Ensure that the navigate function is called with the correct arguments
    const router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard', component.rollNumber]);
  });

});
