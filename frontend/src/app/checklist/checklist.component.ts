import { Component, OnInit } from '@angular/core';
import { DegreeService } from '../degree.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css'],
})
export class ChecklistComponent implements OnInit {
  displayedColumns: string[] = ['course', 'status', 'credits'];
  dataSource: MatTableDataSource<any>;

  constructor(private degreeService: DegreeService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    // Call the service to fetch student data
    this.populateTable();
  }

  populateTable() {
    this.degreeService
      .getMandatoryCourses('CSE', 2019020)
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
          });
        }

        // Assign the new data to the MatTableDataSource
        this.dataSource.data = [...this.dataSource.data, ...newData];

        // console.log(courseList);
        console.log(this.dataSource);
      });
  }
}
