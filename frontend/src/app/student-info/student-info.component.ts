import { Component } from '@angular/core';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent {
  rollNumber: string = '12345'; // Replace with the actual student's roll number
  studentName: string = 'John Doe'; // Replace with the actual student's name
}
