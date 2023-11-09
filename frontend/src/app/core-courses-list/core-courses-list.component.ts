import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { StudentServiceService } from '../student-service.service';

@Component({
  selector: 'app-core-courses-list',
  templateUrl: './core-courses-list.component.html',
  styleUrls: ['./core-courses-list.component.css']
})
export class CoreCoursesListComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  rollNumber: number = 0;
  branch: string = '';
  tablesData: MatTableDataSource<any>[] = [];
  displayedColumns: string[] = ['course', 'status', 'credits', 'grade'];
  completedBuckets = [true, true, true, true, true];

  constructor(private route: ActivatedRoute, private studentService: StudentServiceService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.rollNumber = params['rollNumber'];
      this.branch = params['branch'];
      this.fetchData();
    });
  }

  fetchData() {
    this.studentService
      .getMandatoryCourses(this.branch, this.rollNumber)
      .subscribe((data: any) => {
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

      this.studentService
      .getBucketCourses(this.branch, this.rollNumber)
      .subscribe((data: any) => {
        let courseBucketDetails = data;

        for (let i = 0; i < courseBucketDetails.length; i++) {
          let atleastOne = false;
          const newData = [];

          for (let j = 0; j < courseBucketDetails[i].length; j++) {
            newData.push({
              course: courseBucketDetails[i][j].course,
              status: courseBucketDetails[i][j].status,
              credits: courseBucketDetails[i][j].credits,
              grade: courseBucketDetails[i][j].grade,
            });
            if (courseBucketDetails[i][j].status === 'Complete') {
              atleastOne = true;
            }
            
          }

          if (!atleastOne) {
            this.completedBuckets[i] = false;
          }
          this.tablesData.push(new MatTableDataSource(newData));
        }
      });
  }
}
