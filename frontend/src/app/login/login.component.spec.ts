import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { StudentServiceService } from '../student-service.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let studentServiceStub: jasmine.SpyObj<StudentServiceService>;
  let router: Router;

  beforeEach(() => {
    studentServiceStub = jasmine.createSpyObj('StudentServiceService', ['login']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule, FormsModule], // Add FormsModule
      providers: [
        { provide: StudentServiceService, useValue: studentServiceStub },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to student-info-input on successful login', () => {
    studentServiceStub.login.and.returnValue(of({}));

    const routerSpy = spyOn(router, 'navigate');

    component.onLogin();

    expect(routerSpy).toHaveBeenCalledWith(['/student-info-input']);
  });  
});
