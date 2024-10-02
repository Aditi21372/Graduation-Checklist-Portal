import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';
@Component({
  selector: 'app-update-twice-fail',
  templateUrl: './update-twice-fail.component.html',
  styleUrls: ['./update-twice-fail.component.css'],
})
export class UpdateTwiceFailComponent {
  studentRollNumber: string = '';
  showContent: boolean = true;
  rollNumberExists: boolean = false;
  showMessage: string = '';
  failCoursesList: any;
  substituteCoursesList: any;
  showFailCourses: boolean = false;
  showSubCourses: boolean = false;
  selectedFailCourse: string = '';
  selectedSubstituteCourse: string = '';

  constructor(
    private router: Router,
    private studentService: StudentServiceService
  ) {}

  ngOnInit() {
    this.rollNumberExists = false;
    this.showMessage = '';
  }

  onSubmit() {
    this.showMessage = '';
    this.studentService
      .getStudentTwiceFailCourses(this.studentRollNumber)
      .subscribe(
        (response) => {
          this.failCoursesList = response;
          this.showFailCourses = true;
        },
        (error) => {
          this.showMessage = error.error.error;
        }
      );
  }

  goBack() {
    this.router.navigate(['/selection']);
  }

  submitFailedSelection() {
    if (this.selectedFailCourse === '') {
      this.showMessage = 'Please select a course';
      return;
    }
    this.showMessage = '';
    this.studentService
      .getSubsituteCourses(
        this.studentRollNumber,
        this.failCoursesList[this.selectedFailCourse]['courseCode']
      )
      .subscribe((response) => {
        this.substituteCoursesList = response;
        this.showSubCourses = true;
      });
  }

  submitSubstituteSelection() {
    if (this.selectedSubstituteCourse === '') {
      this.showMessage = 'Please select a course';
      return;
    }
    this.studentService
      .updateTwiceFailCourses(
        this.studentRollNumber,
        this.failCoursesList[this.selectedFailCourse]['courseCode'],
        this.substituteCoursesList[this.selectedSubstituteCourse]['courseCode'],
      )
      .subscribe((response) => {
        this.showMessage = response;
      });
      
  }
}
