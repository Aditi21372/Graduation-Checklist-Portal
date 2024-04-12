import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';

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
    private studentService: StudentServiceService
  ) {}

  ngOnInit() {
    this.rollNumberExists = false;
    this.showMessage = '';
  }

  onSubmit() {
    this.studentService.getStudentData(this.studentRollNumber).subscribe(
      (data) => {
        this.rollNumberExists = true;
        this.showContent = false;
        this.showMessage = '';
        this.router.navigate(['/dashboard', this.studentRollNumber]);
        console.log(data);
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
