import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../utility.service';
import { StudentServiceService } from '../student-service.service';

interface Course {
  'Course Code': string;
  Course: string;
  'Batch / Term Code': string;
  Credit: number;
  Grade: string;
}

@Component({
  selector: 'app-minors-details',
  templateUrl: './minors-details.component.html',
  styleUrls: ['./minors-details.component.css'],
})
export class MinorsDetailsComponent {
  dataSource: MatTableDataSource<any>;
  rollNumber: number = 0;
  stream: string = '';
  program: string = '';
  studentName: string = '';
  courseData: any;
  totalCredits: number = 0;
  ipCredits: number = 0;
  btpCredits: number = 0;
  showIpButton: boolean = false;
  ipData: Course[] = [];
  selectedCourse: boolean = false;
  showApprenticeshipButton: boolean = false;
  showIpData: boolean = false;
  selectedCourseIndex: number | null = null;
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
    private utilityService: UtilityService,
    private studentService: StudentServiceService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.studentName = params['studentName'];
      this.program = params['program'];
      this.rollNumber = params['rollNumber'];
      this.stream = params['stream'];
      this.ipCredits = params['ipCredits'];
      this.btpCredits = params['btpCredits'];
      this.courseData = JSON.parse(params['courseData']);
      this.populateMinorsDetails();
    });

    if (this.stream === 'Entrepreneurship') {
      this.showApprenticeshipButton = true;
    }

    if (
      (this.totalCredits === 16 &&
        this.ipCredits >= 4 &&
        this.stream !== 'Entrepreneurship') ||
      (this.totalCredits >= 16 &&
        this.stream === 'Entrepreneurship' &&
        this.btpCredits >= 8)
    ) {
      this.showIpButton = true;
    }
  }

  populateMinorsDetails() {
    const newData = [];
    this.totalCredits = this.courseData.credits;
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

    for (const courseData of this.courseData.additionalCreditsCompleted.data) {
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

    for (const courseData of this.courseData.ipIncluded.data) {
      newData.push({
        type: 'IP Course',
        courseCode: courseData.course,
        courseName: courseData.courseName,
        semester: courseData.semester,
        status: courseData.status,
        credits: courseData.credits,
        grade: courseData.grade,
      });
    }

    if (this.stream === 'Entrepreneurship') {
      for (const courseData of this.courseData.apprenticeship.data) {
        newData.push({
          type: 'Apprenticeship',
          courseCode: courseData.course,
          courseName: courseData.courseName,
          semester: courseData.semester,
          status: courseData.status,
          credits: courseData.credits,
          grade: courseData.grade,
        });
        this.showApprenticeshipButton = false;
      }
    }

    this.dataSource.data = [...this.dataSource.data, ...newData];
    this.dataSource.data.sort((a: any, b: any) =>
      this.utilityService.customSort(a.semester, b.semester)
    );
  }

  goBack() {
    this.router.navigate(['/dashboard', this.rollNumber]);
  }

  countIP() {
    this.studentService.getIpMinors(this.stream).subscribe((response) => {
      this.ipData = response.sort((a: any, b: any) =>
        this.utilityService.customSort(
          a['Batch / Term Code'],
          b['Batch / Term Code']
        )
      );
      this.showIpData = true;
    });
  }

  submitSelection() {
    if (this.selectedCourseIndex === null) {
      return;
    }
    this.selectedCourse = true;
    this.studentService
      .updateMinors(
        this.ipData[this.selectedCourseIndex],
        this.courseData.stream
      )
      .subscribe((response) => {
        this.router.navigate(['/dashboard', this.rollNumber]);
      });
  }

  approveApprenticeship() {
    this.studentService.approveApprenticeship().subscribe((response) => {
      this.router.navigate(['/dashboard', this.rollNumber]);
    });
  }
}
