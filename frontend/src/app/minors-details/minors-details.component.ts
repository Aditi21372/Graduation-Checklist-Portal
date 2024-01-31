import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-minors-details',
  templateUrl: './minors-details.component.html',
  styleUrls: ['./minors-details.component.css'],
})
export class MinorsDetailsComponent {
  dataSource: MatTableDataSource<any>;
  rollNumber: number = 0;
  branch: string = '';
  program: string = '';
  studentName: string = '';
  courseData: any;
  displayedColumns: string[] = [
    'type',
    'courseCode',
    'courseName',
    'semester',
    'status',
    'credits',
    'grade',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.studentName = params['studentName'];
      this.program = params['program'];
      this.rollNumber = params['rollNumber'];
      this.branch = params['branch'];
      this.courseData = JSON.parse(params['courseData']);
      this.populateMinorsDetails();
    });
  }

  populateMinorsDetails() {
    const newData = [];
    for (const course of Object.values(
      this.courseData.coreCoursesCompleted.data
    )) {
      const courseData: any = course;
      newData.push({
        type: 'Core Course',
        courseCode: courseData.course,
        courseName: courseData.courseName,
        semester: courseData.semester,
        status: courseData.status,
        credits: courseData.credits,
        grade: courseData.grade,
      });
    }

    for (const courseData of 
      this.courseData.additionalCreditsCompleted.data
    ) {
      newData.push({
        type: 'Additional Course',
        courseCode: courseData.course,
        courseName: courseData.courseName,
        semester: courseData.semester,
        status: courseData.status,
        credits: courseData.credits,
        grade: courseData.grade,
      });
    }

    this.dataSource.data = [...this.dataSource.data, ...newData];
    this.dataSource.data.sort((a: any, b: any) =>
      this.utilityService.customSort(a.semester, b.semester)
    );
  }

  goBack() {
    this.router.navigate(['/dashboard', this.rollNumber]);
  }
}
