import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { BranchCoursesListComponent } from './branch-courses-list.component';
import { MatCardModule } from '@angular/material/card';

describe('BranchCoursesListComponent', () => {
  let component: BranchCoursesListComponent;
  let fixture: ComponentFixture<BranchCoursesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchCoursesListComponent],
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
                  courseData: '[{"course": "History", "semester": 3, "status": "Complete", "credits": 3, "grade": "A"}, {"course": "Chemistry", "semester": 4, "status": "Incomplete", "credits": 4, "grade": null}]',
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
    fixture = TestBed.createComponent(BranchCoursesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate branch courses on initialization', () => {
    expect(component.dataSource.data.length).toBe(2); // Assuming two courses in the courseData
    // Add more expectations if needed
  });

  it('should navigate back to dashboard on goBack()', () => {
    component.goBack();
    // Ensure that the navigate function is called with the correct arguments
    const router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard', component.rollNumber]);
  });
});
