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
    this.degreeService.getMandatoryCourses('CSE').subscribe((data: any) => {
      let courseList = data;

      // Create a new array to store the data
      const newData = [];

      for (let i = 0; i < courseList.length; i++) {
        newData.push({
          course: courseList[i],
          status: '',
          credits: 0,
        });
      }

      // Assign the new data to the MatTableDataSource
      this.dataSource.data = [...this.dataSource.data, ...newData];

      console.log(courseList);
      console.log(this.dataSource);
    });
  }
  // this.dataSource.push({course: 'Course 1', status: 'In Progress', credits: 3});
  // Populate all elements of course list into the course field in dataSource
}
