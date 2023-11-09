import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentServiceService } from '../student-service.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css'],
})
export class ChecklistComponent implements OnInit {
  @Input() rollNumber: number = 0;
  @Output() graduationStatusChanged: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  branch: string = '';
  displayedColumn: string[] = ['rule', 'status', 'credits', 'actions'];
  isTable1Expanded = true;
  isTable2Expanded = [true, true, true, true, true];
  completedMandatory = true;
  completedBuckets = [true, true, true, true, true];
  completedCoreCourses = true;
  isCoreCoursesExpanded = true;
  dataSourceTwo: MatTableDataSource<any>;
  isChecklistVisible = false;
  rules: any[] = [];
  hasGraduated: boolean[] = [];
  graduationStatus: boolean = false;

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

  
          this.populateMandatory(),
          this.populateBuckets(),
          this.populateSSH(),
          this.populateCW(),
          this.populateSG(),
          this.populate32Credits(),
          this.populateIPCredits(),
          this.populateOnlineCourseCredits(),
          this.populateTwoXXCredits(),
          this.populateBTP(),
          this.required156Credits(),
        

        this.setGraduationStatus(this.hasGraduated)
      });
  }

  populateMandatory() {
    this.branch = this.branch.slice(
      this.branch.lastIndexOf('/') + 1,
      this.branch.length
    );

    this.studentService
      .getMandatoryCourses(this.branch, this.rollNumber)
      .subscribe((data: any) => {
        let courseDetails = data;
        let credits = 0;

        for (let i = 0; i < courseDetails.length; i++) {

          if (courseDetails[i].status !== 'Complete') {
            this.completedMandatory = false;
          } else {
            credits += courseDetails[i].credits;
          }
        }

        let status = 'Incomplete';

        if (this.completedMandatory) {
          status = 'Complete';
          this.hasGraduated.push(true);
        } else {
          this.hasGraduated.push(false);
        }

        const tempData = [];
        tempData.push({
          rule: 'Core Courses',
          status: status,
          credits: credits,
          button_text: 'View Core Courses',
        });
        this.rules.push(tempData);
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...tempData];
      });
  }

  populateBuckets() {
    this.studentService
      .getBucketCourses(this.branch, this.rollNumber)
      .subscribe((data: any) => {
        let courseBucketDetails = data;

        for (let i = 0; i < courseBucketDetails.length; i++) {
          let atleastOne = false;

          for (let j = 0; j < courseBucketDetails[i].length; j++) {


            if (courseBucketDetails[i][j].status === 'Complete') {
              atleastOne = true;
            }
          }
          if (!atleastOne) {
            this.completedBuckets[i] = false;
          }
        }
      });
  }

  populateSSH() {
    this.studentService
      .getSSHcourses(this.rollNumber)
      .subscribe((data: any) => {
        let courseBucketDetails = data;

        const newData = [];
        newData.push({
          rule: '12 credits of SSH courses',
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
          button_text: 'View SSH Courses',
        });

        if (courseBucketDetails.status !== 'Complete') {
          this.hasGraduated.push(false);
        } else {
          this.hasGraduated.push(true);
        }
        this.rules.push(newData);
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populateCW() {
    this.studentService.getCWcourses(this.rollNumber).subscribe((data: any) => {
      let courseBucketDetails = data;

      const newData = [];
      newData.push({
        rule: '2 credits of Community Work',
        status: courseBucketDetails.status,
        credits: courseBucketDetails.credits,
        button_text: 'View Details',
      });
      this.rules.push(newData);
      if (courseBucketDetails.status !== 'Complete') {
        this.hasGraduated.push(false);
      } else {
        this.hasGraduated.push(true);
      }
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  populateSG() {
    this.studentService.getSGcourses(this.rollNumber).subscribe((data: any) => {
      let courseBucketDetails = data;

      const newData = [];
      newData.push({
        rule: '2 credits of Self Growth',
        status: courseBucketDetails.status,
        credits: courseBucketDetails.credits,
        button_text: 'View Details',
      });
      this.rules.push(newData);
      if (courseBucketDetails.status !== 'Complete') {
        this.hasGraduated.push(false);
      } else {
        this.hasGraduated.push(true);
      }
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  populateBTP() {
    this.studentService
      .getBTPCredits(this.rollNumber)
      .subscribe((data: any) => {
        let courseBucketDetails = data;

        const newData = [];
        newData.push({
          rule: 'BTP',
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
          button_text: 'View Details',
        });
        this.rules.push(newData);
        if (courseBucketDetails.status !== 'Complete') {
          this.hasGraduated.push(false);
        } else {
          this.hasGraduated.push(true);
        }
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populateTwoXXCredits() {
    this.studentService
      .getTwoXXCredits(this.rollNumber)
      .subscribe((data: any) => {
        let courseBucketDetails = data;

        const newData = [];
        newData.push({
          rule: 'Atmost two 2xx level courses',
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
          button_text: 'View Courses',
        });
        this.rules.push(newData);
        if (courseBucketDetails.status !== 'Complete') {
          this.hasGraduated.push(false);
        } else {
          this.hasGraduated.push(true);
        }
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populateIPCredits() {
    this.studentService.getIPCredits(this.rollNumber).subscribe((data: any) => {
      let courseBucketDetails = data;

      const newData = [];
      newData.push({
        rule: 'Atmost 8 credits of IP/IS/UR',
        status: courseBucketDetails.status,
        credits: courseBucketDetails.credits,
        button_text: 'View Details',
      });
      this.rules.push(newData);
      if (courseBucketDetails.status !== 'Complete') {
        this.hasGraduated.push(false);
      } else {
        this.hasGraduated.push(true);
      }
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  populateOnlineCourseCredits() {
    this.studentService
      .getOnlineCourseCredits(this.rollNumber)
      .subscribe((data: any) => {
        let courseBucketDetails = data;

        const newData = [];
        newData.push({
          rule: 'Atmost 8 credits of online courses',
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
          button_text: 'View Online Courses',
        });
        this.rules.push(newData);
        if (courseBucketDetails.status !== 'Complete') {
          this.hasGraduated.push(false);
        } else {
          this.hasGraduated.push(true);
        }
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populate32Credits() {
    this.studentService.get32Credits(this.rollNumber).subscribe((data: any) => {
      let courseBucketDetails = data;

      const newData = [];
      newData.push({
        rule: '32 Credits of CSE Courses',
        status: courseBucketDetails.status,
        credits: courseBucketDetails.credits,
        button_text: 'View CSE Courses',
      });
      this.rules.push(newData);
      if (courseBucketDetails.status !== 'Complete') {
        this.hasGraduated.push(false);
      } else {
        this.hasGraduated.push(true);
      }
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  required156Credits() {
    this.studentService
      .getRequiredCredits(this.rollNumber)
      .subscribe((data: any) => {
        let completedCredits = data;

        if (completedCredits.status !== 'Complete') {
          this.hasGraduated.push(false);
        } else {
          this.hasGraduated.push(true);
        }
      });
  }

  setGraduationStatus(hasGraduated: boolean[]): void {
    this.graduationStatus = true; // Assume true initially
    console.log(hasGraduated);
    for (const index in hasGraduated) {
      if (!index) {
        this.graduationStatus = false;
        break; // Break out of the loop if any element is false
      }
    }
    this.graduationStatusChanged.emit(this.graduationStatus);
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
        this.router.navigate(['/ssh-courses-list', {rollnumber: this.rollNumber, branch: this.branch}]);
        break;
      case '2 credits of Community Work':
        this.router.navigate(['/cw-details', {rollnumber: this.rollNumber, branch: this.branch}]);
        break;
      case '2 credits of Self Growth':
        this.router.navigate(['/sg-details', {rollnumber: this.rollNumber, branch: this.branch}]);
        break;
      case 'BTP':
        this.router.navigate(['/btp-details', {rollnumber: this.rollNumber, branch: this.branch}]);
        break;
      case 'Atmost two 2xx level courses':
        this.router.navigate(['/twoxx-courses-list', {rollnumber: this.rollNumber, branch: this.branch}]);
        break;
      case 'Atmost 8 credits of IP/IS/UR':
        this.router.navigate(['/ip-details', {rollnumber: this.rollNumber, branch: this.branch}]);
        break;
      case '32 Credits of CSE Courses':
        this.router.navigate(['/branch-courses-list', {rollnumber: this.rollNumber, branch: this.branch}]);
        break;
      case 'Atmost 8 credits of online courses':
        this.router.navigate(['/online-courses-list', {rollnumber: this.rollNumber, branch: this.branch}]);
        break;
    }
  }
}
