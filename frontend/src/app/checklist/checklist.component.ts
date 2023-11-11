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
  @Output() graduationStatusChanged: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  branch: string = '';
  displayedColumn: string[] = ['rule', 'status', 'credits', 'actions'];
  completedMandatory = true;
  completedBuckets = [true, true, true, true, true];
  completedCoreCourses = true;
  isCoreCoursesExpanded = true;
  dataSourceTwo: MatTableDataSource<any>;
  isChecklistVisible = false;
  rules: any[] = [];
  hasGraduated: boolean;

  constructor(
    private studentService: StudentServiceService,
    private router: Router
  ) {
    this.dataSourceTwo = new MatTableDataSource();
    this.hasGraduated = true;
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
  
        forkJoin([
          this.populateBuckets(),
          this.populateMandatory(),
          this.populateSSH(),
          this.populateCW(),
          this.populateSG(),
          this.populate32Credits(),
          this.populateIPCredits(),
          this.populateOnlineCourseCredits(),
          this.populateTwoXXCredits(),
          this.populateBTP(),
          this.required156Credits()
        ]).subscribe(() => {
          this.setGraduationStatus();
        });
      });
  }

  populateMandatory(): Observable<void> {

    return this.studentService
      .getMandatoryCourses(this.branch, this.rollNumber)
      .pipe(map((data: any) => {
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
        let atleastOne = false;

        for(const bucket of this.completedBuckets){
          if(!bucket){
            atleastOne = true;
            break;
          }
        }

        if (this.completedMandatory && !atleastOne) {
          status = 'Complete';
        } else {
          this.hasGraduated = false;
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
      }));
  }

  populateBuckets(): Observable<void> {
    return this.studentService
      .getBucketCourses(this.branch, this.rollNumber)
      .pipe(map((data: any) => {
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
      }));
  }

  populateSSH(): Observable<void> {
    return this.studentService
      .getSSHcourses(this.rollNumber)
      .pipe(map((data: any) => {
        let courseBucketDetails = data;

        const newData = [];
        newData.push({
          rule: '12 credits of SSH courses',
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
          button_text: 'View SSH Courses',
        });

        if (courseBucketDetails.status !== 'Complete') {
          this.hasGraduated = false;
        }
        this.rules.push(newData);
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      }));
  }

  populateCW(): Observable<void>  {
    return this.studentService.getCWcourses(this.rollNumber).pipe(map((data: any) => {
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
        this.hasGraduated = false;
      }
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    }));
  }

  populateSG(): Observable<void>  {
    return this.studentService.getSGcourses(this.rollNumber).pipe(map((data: any) => {
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
        this.hasGraduated = false;
      }
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    }));
  }

  populateBTP(): Observable<void>  {
    return this.studentService
      .getBTPCredits(this.rollNumber)
      .pipe(map((data: any) => {
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
          this.hasGraduated = false;
        }
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      }));
  }

  populateTwoXXCredits(): Observable<void>  {
    return this.studentService
      .getTwoXXCredits(this.rollNumber)
      .pipe(map((data: any) => {
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
          this.hasGraduated = false;
        }
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      }));
  }

  populateIPCredits(): Observable<void>  {
    return this.studentService.getIPCredits(this.rollNumber).pipe(map((data: any) => {
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
        this.hasGraduated = false;
      }
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    }));
  }

  populateOnlineCourseCredits(): Observable<void>  {
    return this.studentService
      .getOnlineCourseCredits(this.rollNumber)
      .pipe(map((data: any) => {
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
          this.hasGraduated = false;
        }
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      }));
  }

  populate32Credits(): Observable<void>  {
    return this.studentService.get32Credits(this.rollNumber).pipe(map((data: any) => {
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
        this.hasGraduated = false;
      }
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    }));
  }

  required156Credits(): Observable<void>  {
    return this.studentService
      .getRequiredCredits(this.rollNumber)
      .pipe(map((data: any) => {
        let completedCredits = data;

        if (completedCredits.status !== 'Complete') {
          this.hasGraduated = false;
        }
      }));
  }

  setGraduationStatus(): void {
    this.graduationStatusChanged.emit(this.hasGraduated);
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
