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

  constructor(
    private studentService: StudentServiceService,
    private router: Router
  ) {
    this.dataSourceTwo = new MatTableDataSource();
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

        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...tempData];
      });
  }

  populateBuckets(): void {
    this.studentService
      .getBucketCourses(this.branch, this.rollNumber)
      .subscribe((ruleData: any) => {
        this.bucketsRuleCompleted = ruleData.isComplete;
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
          credits: ruleData.data,
          button_text: 'View SSH Courses',
        });

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
        credits: ruleData.data,
        button_text: 'View Details',
      });

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
        credits: ruleData.data,
        button_text: 'View Details',
      });

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
          credits: ruleData.data,
          button_text: 'View Details',
        });

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
        credits: ruleData.data,
        button_text: 'View Details',
      });

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
          credits: ruleData.data,
          button_text: 'View Online Courses',
        });

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
        credits: ruleData.data,
        button_text: 'View CSE Courses',
      });

      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  // Add this function to navigate to different pages based on the row data
  navigateToPage(element: any): void {
    // Example: Navigate to a page based on the 'rule' property
    switch (element.rule) {
      case 'Core Courses':
        this.router.navigate(['/core-courses-list'], {
          queryParams: { rollNumber: this.rollNumber, branch: this.branch },
        });
        break;
      case '12 credits of SSH courses':
        this.router.navigate([
          '/ssh-courses-list',
          { rollnumber: this.rollNumber, branch: this.branch },
        ]);
        break;
      case '2 credits of Community Work':
        this.router.navigate([
          '/cw-details',
          { rollnumber: this.rollNumber, branch: this.branch },
        ]);
        break;
      case '2 credits of Self Growth':
        this.router.navigate([
          '/sg-details',
          { rollnumber: this.rollNumber, branch: this.branch },
        ]);
        break;
      case 'BTP':
        this.router.navigate([
          '/btp-details',
          { rollnumber: this.rollNumber, branch: this.branch },
        ]);
        break;
      case 'Atmost two 2xx level courses':
        this.router.navigate([
          '/twoxx-courses-list',
          { rollnumber: this.rollNumber, branch: this.branch },
        ]);
        break;
      case 'Atmost 8 credits of IP/IS/UR':
        this.router.navigate([
          '/ip-details',
          { rollnumber: this.rollNumber, branch: this.branch },
        ]);
        break;
      case '32 Credits of CSE Courses':
        this.router.navigate([
          '/branch-courses-list',
          { rollnumber: this.rollNumber, branch: this.branch },
        ]);
        break;
      case 'Atmost 8 credits of online courses':
        this.router.navigate([
          '/online-courses-list',
          { rollnumber: this.rollNumber, branch: this.branch },
        ]);
        break;
    }
  }
}
