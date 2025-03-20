import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-student-info-input',
  templateUrl: './student-info-input.component.html',
  styleUrls: ['./student-info-input.component.css'],
})
export class StudentInfoInputComponent {
  studentRollNumber: string = '';
  showContent: boolean = true;
  rollNumberExists: boolean = false;
  showMessage: string = '';
  constructor(
    private router: Router,
    private studentService: StudentServiceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/login']);
      return;
    }
    this.rollNumberExists = false;
    this.showMessage = '';
  }

  onSubmit() {
    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/login']);
      return;
    }
    this.studentService.getStudentData(this.studentRollNumber).subscribe(
      (data) => {
        this.rollNumberExists = true;
        this.showContent = false;
        this.showMessage = '';
        this.router.navigate(['/dashboard', this.studentRollNumber]);
      },
      (error) => {
        this.showMessage = '';
        this.rollNumberExists = false;
        this.showMessage = "Roll number doesn't exist in the database!";
      }
    );
  }

  goBack() {
    this.router.navigate(['/selection']);
  }
}
