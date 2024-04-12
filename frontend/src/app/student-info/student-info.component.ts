import { Component, OnInit, Input } from '@angular/core';
import { StudentServiceService } from '../student-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css'],
})
export class StudentInfoComponent implements OnInit {
  @Input() rollNumber: number = 0;
  studentName: string = ''; // Initialize with an empty string
  branch: string = '';
  request: boolean = false;
  @Input() gradStatus: Boolean = false;

  constructor(
    private studentService: StudentServiceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Call the service to fetch student data
    this.setStudentData();
    this.setGraduationStatus();
  }

  setStudentData() {
    this.studentService
      .getStudentData(this.rollNumber.toString())
      .subscribe((data: any) => {
        // Assuming the response JSON contains 'name' and 'rollNumber' fields
        this.rollNumber = data['Roll No'];
        this.studentName = data['Name'];
        this.branch = data.branch;
      });
  }

  setGraduationStatus() {
    this.studentService
      .getGraduationStatusFromChecklist()
      .subscribe((data: any) => {
        this.gradStatus = data;
      });
  }

  requestProvisional() {
    this.studentService
      .requestProvisional(this.rollNumber.toString())
      .subscribe((data: any) => {
        // Handle the response from the backend, e.g., display a success message
        this.snackBar.open('Request Sent', '', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      });
  }
}
