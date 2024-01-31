import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-btp-details',
  templateUrl: './btp-details.component.html',
  styleUrls: ['./btp-details.component.css'],
})
export class BtpDetailsComponent {
  dataSource: MatTableDataSource<any>;
  rollNumber: number = 0;
  branch: string = '';
  program: string = '';
  studentName: string = '';
  courseData: any;
  displayedColumns: string[] = [
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
      this.populateBTPDetails();
    });
  }

  populateBTPDetails() {
    const newData = [];
    for (let i = 0; i < this.courseData.length; i++) {
      newData.push({
        courseCode: this.courseData[i].course,
        courseName: this.courseData[i].courseName,
        semester: this.courseData[i].semester,
        status: this.courseData[i].status,
        credits: this.courseData[i].credits,
        grade: this.courseData[i].grade,
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
