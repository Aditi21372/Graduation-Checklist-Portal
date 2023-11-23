import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { SgDetailsComponent } from './sg-details.component';
import { MatCardModule } from '@angular/material/card';

describe('SgDetailsComponent', () => {
  let component: SgDetailsComponent;
  let fixture: ComponentFixture<SgDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SgDetailsComponent],
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
    fixture = TestBed.createComponent(SgDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
