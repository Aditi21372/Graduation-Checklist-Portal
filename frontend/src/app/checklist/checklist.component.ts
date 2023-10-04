import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentServiceService } from '../student-service.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css'],
})
export class ChecklistComponent implements OnInit {
  displayedColumns: string[] = ['course', 'status', 'credits', 'grade'];
  dataSource: MatTableDataSource<any>;

  constructor(private studentService: StudentServiceService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    // // Call the service to fetch student data
    this.populateTable();
  }

  populateTable() {
    this.studentService
      .getMandatoryCourses('CSE', 2019107)
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource();
        let courseDetails = data;

        console.log(courseDetails);

        // Create a new array to store the data
        const newData = [];

        for (let i = 0; i < courseDetails.length; i++) {
          newData.push({
            course: courseDetails[i].course,
            status: courseDetails[i].status,
            credits: courseDetails[i].credits,
            grade: courseDetails[i].grade,
          });
        }

        // Assign the new data to the MatTableDataSource
        this.dataSource.data = [...this.dataSource.data, ...newData];

        // console.log(courseList);
        console.log(this.dataSource);
      });
  }
}
