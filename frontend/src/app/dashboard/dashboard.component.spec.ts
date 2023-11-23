import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { StudentInfoComponent } from '../student-info/student-info.component';
import { ChecklistComponent } from '../checklist/checklist.component';
import { MatTableModule } from '@angular/material/table';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, StudentInfoComponent, ChecklistComponent],
      imports: [RouterTestingModule, HttpClientModule, MatCardModule, MatTableModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: {
              subscribe: (fn: (value: any) => void) =>
                fn({ rollNumber: '123' }),
            },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to student-info-input', () => {
    const router = TestBed.inject(Router);
    const spy = spyOn(router, 'navigate');
    component.goBack();
    expect(spy).toHaveBeenCalledWith(['/student-info-input']);
  });

  it('should navigate to login', () => {
    const router = TestBed.inject(Router);
    const spy = spyOn(router, 'navigate');
    component.logout();
    expect(spy).toHaveBeenCalledWith(['/login']);
  });
});
