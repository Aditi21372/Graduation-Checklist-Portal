import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-update-student-database',
  templateUrl: './update-student-database.component.html',
  styleUrls: ['./update-student-database.component.css'],
})
export class UpdateStudentDatabaseComponent {
  studentRollNumber: string = '';
  showContent: boolean = false;
  rollNumberExists: boolean = false;
  showMessage: string = '';
  studentDataArray: any;
  editedStudentGrade: string = '';
  editStudentFormVisible: boolean = false;
  editedStudent: any;
  constructor(
    private router: Router,
    private studentService: StudentServiceService
  ) {}

  ngOnInit() {
    this.rollNumberExists = false;
    this.showMessage = '';
  }

  onSubmit() {
    this.studentService.getStudentCourses(this.studentRollNumber).subscribe(
      (data) => {
        this.rollNumberExists = true;
        this.showContent = true;
        this.showMessage = '';
        this.studentDataArray = data;
      },
      (error) => {
        this.showMessage = '';
        this.rollNumberExists = false;
        this.showContent = false;
        this.showMessage = "Roll number doesn't exist in the database!";
      }
    );
  }

  editStudent(student: any) {
    this.editedStudent = student;
    this.editStudentFormVisible = true;

  }

  submitEdit(editedStudentGrade: string) {
    // Update the grade of the edited student

    this.editedStudent['Grade'] = editedStudentGrade;
    // Call your service to update the student data in the backend
    this.studentService.updateStudent(this.editedStudent).subscribe(
      (data) => {
        this.showMessage = 'Student data updated successfully!';
      },
      (error) => {
        this.showMessage = 'Error updating student data!';
      }
    );
    // Hide the edit form after submission
    this.editStudentFormVisible = false;
  }

  cancelEdit() {
    // Clear the edited student and hide the edit form
    this.editedStudent = null;
    this.editedStudentGrade = '';
    this.editStudentFormVisible = false;
  }
}
