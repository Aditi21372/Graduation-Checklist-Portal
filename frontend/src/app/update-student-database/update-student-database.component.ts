import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';
import { UtilityService } from '../utility.service';

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
  grades: string[] = [
    'A+',
    'A',
    'A-',
    'B',
    'B-',
    'C',
    'C-',
    'D',
    'F',
    'S',
    'X',
    'I',
    'W',
  ];

  constructor(
    private router: Router,
    private studentService: StudentServiceService,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.rollNumberExists = false;
    this.showMessage = '';
  }

  onSubmit() {
    this.studentService.getStudentCourses(this.studentRollNumber).subscribe(
      (data: any[]) => {
        this.rollNumberExists = true;
        this.showContent = true;
        this.showMessage = '';
        this.studentDataArray = data;
        this.studentDataArray.sort((a: any, b: any) =>
          this.utilityService.customSort(
            a['Batch / Term Code'],
            b['Batch / Term Code']
          )
        );
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
    this.editedStudent['Grade'] = editedStudentGrade;
    this.studentService.updateStudent(this.editedStudent).subscribe(
      (data) => {
        this.showMessage = 'Student data updated successfully!';
      },
      (error) => {
        this.showMessage = 'Error updating student data!';
      }
    );
    this.editStudentFormVisible = false;
  }

  cancelEdit() {
    this.editedStudent = null;
    this.editedStudentGrade = '';
    this.editStudentFormVisible = false;
  }

  goBack() {
    this.router.navigate(['/selection']);
  }
}
