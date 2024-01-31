import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-core-courses-list',
  templateUrl: './core-courses-list.component.html',
  styleUrls: ['./core-courses-list.component.css'],
})
export class CoreCoursesListComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  rollNumber: number = 0;
  studentName: string = '';
  program: string = '';
  branch: string = '';
  tablesData: MatTableDataSource<any>[] = [];
  displayedColumns: string[] = [
    'course',
    'courseName',
    'semester',
    'status',
    'credits',
    'grade',
  ];
  coreCourseData: any;
  bucketCourseData: any;
  completedBuckets: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.rollNumber = params['rollNumber'];
      this.studentName = params['studentName'];
      this.program = params['program'];
      this.branch = params['branch'];
      this.coreCourseData = JSON.parse(params['coreCourseData']);
      this.bucketCourseData = JSON.parse(params['bucketCourseData']);
      this.completedBuckets = JSON.parse(params['completedBuckets']);
      this.populateCoreCourses();
    });
  }

  populateCoreCourses() {
    const newData = [];
    for (let i = 0; i < this.coreCourseData.length; i++) {
      newData.push({
        course: this.coreCourseData[i].course,
        courseName: this.coreCourseData[i].courseName,
        semester: this.coreCourseData[i].semester,
        status: this.coreCourseData[i].status,
        credits: this.coreCourseData[i].credits,
        grade: this.coreCourseData[i].grade,
      });
    }
    this.dataSource.data = [...this.dataSource.data, ...newData];
    this.dataSource.data.sort((a: any, b: any) =>
      this.utilityService.customSort(a.semester, b.semester)
    );

    for (let i = 0; i < this.bucketCourseData.length; i++) {
      const newData = [];

      for (let j = 0; j < this.bucketCourseData[i].length; j++) {
        newData.push({
          course: this.bucketCourseData[i][j].course,
          courseName: this.bucketCourseData[i][j].courseName,
          semester: this.bucketCourseData[i][j].semester,
          status: this.bucketCourseData[i][j].status,
          credits: this.bucketCourseData[i][j].credits,
          grade: this.bucketCourseData[i][j].grade,
        });
      }

      this.tablesData.push(new MatTableDataSource(newData));
    }
  }

  goBack() {
    this.router.navigate(['/dashboard', this.rollNumber]);
  }
}
