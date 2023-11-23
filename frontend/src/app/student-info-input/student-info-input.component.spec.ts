import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StudentInfoInputComponent } from './student-info-input.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { StudentServiceService } from '../student-service.service';

describe('StudentInfoInputComponent', () => {
  let component: StudentInfoInputComponent;
  let fixture: ComponentFixture<StudentInfoInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        FormsModule
      ],
      declarations: [StudentInfoInputComponent],
      providers: [
        StudentServiceService
      ]
    });
    fixture = TestBed.createComponent(StudentInfoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
