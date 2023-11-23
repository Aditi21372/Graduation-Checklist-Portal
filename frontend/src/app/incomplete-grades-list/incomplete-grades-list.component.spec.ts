import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { IncompleteGradesListComponent } from './incomplete-grades-list.component';
import { MatCardModule } from '@angular/material/card';

describe('IncompleteGradesListComponent', () => {
  let component: IncompleteGradesListComponent;
  let fixture: ComponentFixture<IncompleteGradesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncompleteGradesListComponent],
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
                  courseData: '[{"course": "History", "semester": 3, "status": "Incomplete", "credits": 3, "grade": null}, {"course": "Chemistry", "semester": 4, "status": "Incomplete", "credits": 4, "grade": null}]',
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
    fixture = TestBed.createComponent(IncompleteGradesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back to dashboard on goBack()', () => {
    component.goBack();
    // Ensure that the navigate function is called with the correct arguments
    const router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard', component.rollNumber]);
  });
});
