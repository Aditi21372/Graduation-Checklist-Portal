import { Component, OnInit, Input } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { StudentServiceService } from "../student-service.service";

@Component({
  selector: "app-checklist",
  templateUrl: "./checklist.component.html",
  styleUrls: ["./checklist.component.css"],
})
export class ChecklistComponent implements OnInit {
  @Input() rollNumber: number = 0;
  branch: string = "";
  displayedColumns: string[] = ["course", "status", "credits", "grade"];
  dataSource: MatTableDataSource<any>;
  isChecklistVisible = false;
  tablesData: MatTableDataSource<any>[] = [];

  constructor(private studentService: StudentServiceService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    // // Call the service to fetch student data
    this.studentService
      .getStudentData(this.rollNumber.toString())
      .subscribe((data: any) => {
        this.branch = data.branch;
        this.populateTable();
        this.populateBuckets();
      });
  }

  populateTable() {
    this.branch = this.branch.slice(
      this.branch.lastIndexOf("/") + 1,
      this.branch.length
    );

    this.studentService
      .getMandatoryCourses(this.branch, 2019107)
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource();
        let courseDetails = data;

        const newData = [];

        for (let i = 0; i < courseDetails.length; i++) {
          newData.push({
            course: courseDetails[i].course,
            status: courseDetails[i].status,
            credits: courseDetails[i].credits,
            grade: courseDetails[i].grade,
          });
        }

        this.dataSource.data = [...this.dataSource.data, ...newData];
      });
  }

  populateBuckets() {
    this.studentService
      .getBucketCourses(this.branch, 2019107)
      .subscribe((data: any) => {
        let courseBucketDetails = data;

        for (let i = 0; i < courseBucketDetails.length; i++) {
          const newData = [];

          for (let j = 0; j < courseBucketDetails[i].length; j++) {
            newData.push({
              course: courseBucketDetails[i][j].course,
              status: courseBucketDetails[i][j].status,
              credits: courseBucketDetails[i][j].credits,
              grade: courseBucketDetails[i][j].grade,
            });
          }
          this.tablesData.push(new MatTableDataSource(newData));
        }
      });
  }
}
