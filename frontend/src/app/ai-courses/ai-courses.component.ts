import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { UtilityService } from '../utility.service';
@Component({
  selector: 'app-ai-courses',
  templateUrl: './ai-courses.component.html',
  styleUrls: ['./ai-courses.component.css'],
})
export class AiCoursesComponent {
  dataSourceCore: MatTableDataSource<any>;
  dataSourceApplication: MatTableDataSource<any>;
  rollNumber: number = 0;
  studentName: string = '';
  program: string = '';
  displayedColumns: string[] = [
    'course',
    'courseName',
    'semester',
    'status',
    'credits',
    'grade',
  ];
  aiCoreCourses: any;
  aiApplicationCourses: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService
  ) {
    this.dataSourceCore = new MatTableDataSource();
    this.dataSourceApplication = new MatTableDataSource();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.rollNumber = params['rollNumber'];
      this.studentName = params['studentName'];
      this.program = params['program'];
      this.aiCoreCourses = JSON.parse(params['aiCoreCourses']);
      this.aiApplicationCourses = JSON.parse(params['aiApplicationCourses']);
      this.populateCoreCourses();
    });
  }

  populateCoreCourses() {
    const newData = [];
    for (const course of this.aiCoreCourses.courses) {
      newData.push({
        course: course.course,
        courseName: course.courseName,
        semester: course.semester,
        status: course.status,
        credits: course.credits,
        grade: course.grade,
      });
    }
    this.dataSourceCore.data = [...this.dataSourceCore.data, ...newData];
    this.dataSourceCore.data.sort((a: any, b: any) =>
      this.utilityService.customSort(a.semester, b.semester)
    );

    const newData2 = [];

    for (let coreCourse of this.aiApplicationCourses.courses) {
      newData2.push({
        course: coreCourse.course,
        courseName: coreCourse.courseName,
        semester: coreCourse.semester,
        status: coreCourse.status,
        credits: coreCourse.credits,
        grade: coreCourse.grade,
      });
    }

    this.dataSourceApplication.data = [
      ...this.dataSourceApplication.data,
      ...newData2,
    ];
    this.dataSourceApplication.data.sort((a: any, b: any) =>
      this.utilityService.customSort(a.semester, b.semester)
    );
  }

  goBack() {
    this.router.navigate(['/dashboard', this.rollNumber]);
  }
}
