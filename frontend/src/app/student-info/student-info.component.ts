import { Component, OnInit, Input } from '@angular/core';
import { StudentServiceService } from '../student-service.service';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css'],
})
export class StudentInfoComponent implements OnInit {
  @Input() rollNumber: number = 0;
  studentName: string = ''; // Initialize with an empty string
  branch: string = '';
  @Input() gradStatus: Boolean = false;

  constructor(private studentService: StudentServiceService) {}

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
        this.rollNumber = data.rollNumber;
        this.studentName = data.studentName;
        this.branch = data.branch;
      });
  }

  setGraduationStatus() {
    this.studentService
      .getGraduationStatus()
      .subscribe((data: any) => {
        this.gradStatus = data;
      });
  }

}
