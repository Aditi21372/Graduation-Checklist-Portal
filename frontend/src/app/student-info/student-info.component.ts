import { Component, OnInit } from '@angular/core';
import { StudentServiceService } from '../student-service.service';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})

export class StudentInfoComponent implements OnInit {
  rollNumber: string = ''; // Initialize with an empty string
  studentName: string = ''; // Initialize with an empty string

  constructor(private studentService: StudentServiceService) {}

  ngOnInit() {
    // Call the service to fetch student data
    this.getStudentData();
  }

  getStudentData() {
    this.studentService.getStudentData('2019107').subscribe((data: any) => {
      // Assuming the response JSON contains 'name' and 'rollNumber' fields
      this.rollNumber = data.rollNumber;
      this.studentName = data.studentName;
      console.log(this.rollNumber, this.studentName);
      console.log("hi");
    });
  }
}