import { Component, OnInit, Input} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentServiceService } from '../student-service.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css'],
})
export class ChecklistComponent implements OnInit {
  @Input() rollNumber: number = 0;
  branch: string = '';
  displayedColumns: string[] = ['course', 'status', 'credits', 'grade'];
  dataSource: MatTableDataSource<any>;
  isChecklistVisible = false;
  
  constructor(private studentService: StudentServiceService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    // // Call the service to fetch student data
    this.studentService.getStudentData((this.rollNumber).toString()).subscribe((data: any) => {
      this.branch = data.branch;
      this.populateTable();
    });
  }

  populateTable() {
    let slicedbranch = this.branch.slice(this.branch.lastIndexOf('/')+1, this.branch.length);
    console.log("hi branch", slicedbranch, this.branch);

    this.studentService
      .getMandatoryCourses(slicedbranch, 2019107)
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource();
        let courseDetails = data;


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

        console.log(this.dataSource);
      });
  }
}
