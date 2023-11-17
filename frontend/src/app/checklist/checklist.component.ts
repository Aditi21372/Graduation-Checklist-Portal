import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentServiceService } from '../student-service.service';
import { Router } from '@angular/router';
import { forkJoin, Observable, map } from 'rxjs';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css'],
})
export class ChecklistComponent implements OnInit {
  @Input() rollNumber: number = 0;

  branch: string = '';
  displayedColumn: string[] = ['rule', 'status', 'credits', 'actions'];
  bucketsRuleCompleted = false;
  dataSourceTwo: MatTableDataSource<any>;
  courseData: Map<string, any>;
  completedBuckets: any;

  constructor(
    private studentService: StudentServiceService,
    private router: Router
  ) {
    this.dataSourceTwo = new MatTableDataSource();
    this.courseData = new Map<string, any>();
  }

  ngOnInit() {
    // Call the service to fetch student data
    this.studentService
      .getStudentData(this.rollNumber.toString())
      .subscribe((studentData) => {
        this.branch = studentData.branch;
        this.branch = this.branch.slice(
          this.branch.lastIndexOf('/') + 1,
          this.branch.length
        );

        this.populateBuckets();
        this.populateMandatory();
        this.populateSSH();
        this.populateCW();
        this.populateSG();
        this.populate32Credits();
        this.populateIPCredits();
        this.populateOnlineCourseCredits();
        this.populateTwoXXCredits();
        this.populateBTP();
      });
  }

  populateMandatory(): void {
    this.studentService
      .getMandatoryCourses(this.branch, this.rollNumber)
      .subscribe((data: any) => {
        let ruleData = data;

        let status = ruleData.isComplete && this.bucketsRuleCompleted;

        const tempData = [];
        tempData.push({
          rule: 'Core Courses',
          status: status,
          credits: ruleData.data.totalCredits,
          button_text: 'View Core Courses',
        });

        this.courseData.set("Core_Courses", ruleData.data.coreCourses);

        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...tempData];
      });
  }

  populateBuckets(): void {
    this.studentService
      .getBucketCourses(this.branch, this.rollNumber)
      .subscribe((ruleData: any) => {
        this.bucketsRuleCompleted = ruleData.isComplete;
        this.courseData.set("Bucket_Courses", ruleData.data.studentBucketCourses)
        this.completedBuckets = ruleData.data.completedBuckets;
      });
  }

  populateSSH(): void {
    this.studentService
      .getSSHcourses(this.rollNumber)
      .subscribe((ruleData: any) => {
        const newData = [];
        newData.push({
          rule: '12 credits of SSH courses',
          status: ruleData.isComplete,
          credits: ruleData.data.totalCredits,
          button_text: 'View SSH Courses',
        });
        this.courseData.set("SSH_Courses", ruleData.data.courses);

        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populateCW(): void {
    this.studentService.getCWcourses(this.rollNumber).subscribe((data: any) => {
      let ruleData = data;

      const newData = [];
      newData.push({
        rule: '2 credits of Community Work',
        status: ruleData.isComplete,
        credits: ruleData.data.totalCredits,
        button_text: 'View Details',
      });

      this.courseData.set("CW_Details", ruleData.data.courses);

      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  populateSG(): void {
    this.studentService.getSGcourses(this.rollNumber).subscribe((data: any) => {
      let ruleData = data;
      const newData = [];
      newData.push({
        rule: '2 credits of Self Growth',
        status: ruleData.isComplete,
        credits: ruleData.data.totalCredits,
        button_text: 'View Details',
      });

      this.courseData.set("SG_Details", ruleData.data.courses);

      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  populateBTP(): void {
    this.studentService
      .getBTPCredits(this.rollNumber)
      .subscribe((data: any) => {
        let ruleData = data;

        const newData = [];
        newData.push({
          rule: 'BTP',
          status: ruleData.isComplete,
          credits: ruleData.data.totalCredits,
          button_text: 'View Details',
        });

        this.courseData.set("BTP_Details", ruleData.data.courses);

        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populateTwoXXCredits(): void {
    this.studentService
      .getTwoXXCredits(this.rollNumber)
      .subscribe((data: any) => {
        let ruleData = data;

        const newData = [];
        newData.push({
          rule: 'Atmost two 2xx level courses',
          status: ruleData.isComplete,
          credits: ruleData.data,
          button_text: 'View Courses',
        });

        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populateIPCredits(): void {
    this.studentService.getIPCredits(this.rollNumber).subscribe((data: any) => {
      let ruleData = data;

      const newData = [];
      newData.push({
        rule: 'Atmost 8 credits of IP/IS/UR',
        status: ruleData.isComplete,
        credits: ruleData.data.totalCredits,
        button_text: 'View Details',
      });

      this.courseData.set("IP_Details", ruleData.data.courses);

      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  populateOnlineCourseCredits(): void {
    this.studentService
      .getOnlineCourseCredits(this.rollNumber)
      .subscribe((data: any) => {
        let ruleData = data;

        const newData = [];
        newData.push({
          rule: 'Atmost 8 credits of online courses',
          status: ruleData.isComplete,
          credits: ruleData.data.totalCredits,
          button_text: 'View Online Courses',
        });
        this.courseData.set("Online_Courses", ruleData.data.courses);
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populate32Credits(): void {
    this.studentService.get32Credits(this.rollNumber).subscribe((data: any) => {
      let ruleData = data;

      const newData = [];
      newData.push({
        rule: '32 Credits of CSE Courses',
        status: ruleData.isComplete,
        credits: ruleData.data.totalCredits,
        button_text: 'View CSE Courses',
      });

      this.courseData.set("32Credits_Courses", ruleData.data.courseData);
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  // Add this function to navigate to different pages based on the row data
  navigateToPage(element: any): void {
    // Example: Navigate to a page based on the 'rule' property
    switch (element.rule) {
      case 'Core Courses':
        let coreCourses = this.courseData.get("Core_Courses");
        let bucketCourses = this.courseData.get("Bucket_Courses");
        this.router.navigate(['/core-courses-list'], {
          queryParams: { rollNumber: this.rollNumber, branch: this.branch, coreCourseData: JSON.stringify(coreCourses), bucketCourseData: JSON.stringify(bucketCourses), completedBuckets: JSON.stringify(this.completedBuckets)},
        });
        break;
      case '12 credits of SSH courses':
        let sshCourses = this.courseData.get("SSH_Courses");
        this.router.navigate(['/ssh-courses-list'], {
          queryParams: { rollNumber: this.rollNumber, branch: this.branch, courseData: JSON.stringify(sshCourses)},
        });
        break;
      case '2 credits of Community Work':
        let cwDetails = this.courseData.get("CW_Details");
        this.router.navigate(['/cw-details'], {
          queryParams: { rollNumber: this.rollNumber, branch: this.branch, courseData: JSON.stringify(cwDetails)},
        });
        break;
      case '2 credits of Self Growth':
        let sgDetails = this.courseData.get("SG_Details");
        this.router.navigate(['/sg-details'], {
          queryParams: { rollNumber: this.rollNumber, branch: this.branch, courseData: JSON.stringify(sgDetails)},
        });
        break;
      case 'BTP':
        let btpDetails = this.courseData.get("BTP_Details");
        this.router.navigate(['/btp-details'], {
          queryParams: { rollNumber: this.rollNumber, branch: this.branch, courseData: JSON.stringify(btpDetails)},
        });
        break;
      case 'Atmost two 2xx level courses':
        this.router.navigate([
          '/twoxx-courses-list',
          { rollnumber: this.rollNumber, branch: this.branch },
        ]);
        break;
      case 'Atmost 8 credits of IP/IS/UR':
        let ipDetails = this.courseData.get("IP_Details");
        this.router.navigate(['/ip-details'], {
          queryParams: { rollNumber: this.rollNumber, branch: this.branch, courseData: JSON.stringify(ipDetails)},
        });
        break;
      case '32 Credits of CSE Courses':
        let thirtyCreditCourses = this.courseData.get("32Credits_Courses");
        this.router.navigate(['/branch-courses-list'], {
          queryParams: { rollNumber: this.rollNumber, branch: this.branch, courseData: JSON.stringify(thirtyCreditCourses)},
        });
        break;
      case 'Atmost 8 credits of online courses':
        let onlineCourses = this.courseData.get("Online_Courses");
        this.router.navigate(['/online-courses-list'], {
          queryParams: { rollNumber: this.rollNumber, branch: this.branch, courseData: JSON.stringify(onlineCourses)},
        });
        break;
    }
  }
}
