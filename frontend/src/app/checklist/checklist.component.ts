import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentServiceService } from '../student-service.service';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css'],
})
export class ChecklistComponent implements OnInit {
  @Input() rollNumber: number = 0;

  branch: string = '';
  program: string = '';
  studentName: string = '';
  displayedColumn: string[] = ['index', 'rule', 'status', 'credits', 'action'];
  bucketsRuleCompleted: string = '';
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
      .getStudentCourseData(this.rollNumber.toString())
      .subscribe((studentData) => {
        this.program = studentData.branch;
        this.studentName = studentData.studentName;
        this.branch = this.program.slice(
          this.program.lastIndexOf('/') + 1,
          this.program.length
        );

        const observables = [
          this.populateBuckets(),
          this.populateMandatory(),
          this.populateSSH(),
          this.populateCW(),
          this.populateSG(),
          this.populate32Credits(),
          this.populateIPCredits(),
          this.populateOnlineCourseCredits(),
          this.populateTwoXXCredits(),
          this.populateTOCCredits(),
          this.populateBTP(),
          this.populateHonors(),
          this.populateIncompleteGrades(),
        ];

        forkJoin(observables).subscribe(() => {});
      });
  }

  populateMandatory(): Observable<any> {
    this.studentService
      .getMandatoryCourses(this.branch)
      .subscribe((data: any) => {
        let ruleData = data;

        let status = '';
        if (
          ruleData.isCompleteText == this.bucketsRuleCompleted &&
          ruleData.isCompleteBool == true
        ) {
          status = 'Complete';
        } else {
          status = 'Incomplete';
        }

        const tempData = [];
        tempData.push({
          index: 1,
          rule: 'Core Courses',
          status: status,
          credits: ruleData.data.totalCredits,
          button_text: 'View Core Courses',
        });

        this.courseData.set('Core_Courses', ruleData.data.coreCourses);
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...tempData];
      });
    return of(null);
  }

  populateBuckets(): Observable<any> {
    this.studentService
      .getBucketCourses(this.branch)
      .subscribe((ruleData: any) => {
        this.bucketsRuleCompleted = ruleData.isCompleteText;
        this.courseData.set(
          'Bucket_Courses',
          ruleData.data.studentBucketCourses
        );
        this.completedBuckets = ruleData.data.completedBuckets;
      });
    return of(null);
  }

  populateSSH(): Observable<any> {
    this.studentService.getSSHcourses().subscribe((ruleData: any) => {
      const newData = [];
      newData.push({
        index: 2,
        rule: '12 credits of SSH courses',
        status: ruleData.isCompleteText,
        statusBool: ruleData.isCompleteBool,
        credits: ruleData.data.totalCredits,
        button_text: 'View SSH Courses',
      });
      this.courseData.set('SSH_Courses', ruleData.data.courses);

      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
    return of(null);
  }

  populateCW(): Observable<any> {
    this.studentService.getCWcourses().subscribe((data: any) => {
      let ruleData = data;

      const newData = [];
      newData.push({
        index: 3,
        rule: '2 credits of Community Work',
        status: ruleData.isCompleteText,
        statusBool: ruleData.isCompleteBool,
        credits: ruleData.data.totalCredits,
        button_text: 'View Details',
      });

      this.courseData.set('CW_Details', ruleData.data.courses);

      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
    return of(null);
  }

  populateSG(): Observable<any> {
    this.studentService.getSGcourses().subscribe((data: any) => {
      let ruleData = data;
      const newData = [];
      newData.push({
        index: 4,
        rule: '2 credits of Self Growth',
        status: ruleData.isCompleteText,
        statusBool: ruleData.isCompleteBool,
        credits: ruleData.data.totalCredits,
        button_text: 'View Details',
      });

      this.courseData.set('SG_Details', ruleData.data.courses);

      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
    return of(null);
  }

  populateBTP(): Observable<any> {
    this.studentService.getBTPCredits().subscribe((data: any) => {
      let ruleData = data;

      const newData = [];
      newData.push({
        index: 10,
        rule: 'BTP',
        status: ruleData.isCompleteText,
        statusBool: ruleData.isCompleteBool,
        credits: ruleData.data.totalCredits,
        button_text: 'View Details',
      });

      this.courseData.set('BTP_Details', ruleData.data.courses);

      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
    return of(null);
  }

  populateTwoXXCredits(): Observable<any> {
    this.studentService.getTwoXXCredits().subscribe((data: any) => {
      let ruleData = data;

      const newData = [];
      newData.push({
        index: 8,
        rule: 'Atmost two 2xx level courses',
        status: ruleData.isCompleteText,
        statusBool: ruleData.isCompleteBool,
        credits: ruleData.data.totalCredits,
        button_text: 'View Courses',
      });

      this.courseData.set('2XX_Courses', ruleData.data.courses);

      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
    return of(null);
  }

  populateIPCredits(): Observable<any> {
    this.studentService.getIPCredits().subscribe((data: any) => {
      let ruleData = data;

      const newData = [];
      newData.push({
        index: 6,
        rule: 'Atmost 8 credits of IP/IS/UR',
        status: ruleData.isCompleteText,
        statusBool: ruleData.isCompleteBool,
        credits: ruleData.data.totalCredits,
        button_text: 'View Details',
      });

      this.courseData.set('IP_Details', ruleData.data.courses);

      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
    return of(null);
  }

  populateOnlineCourseCredits(): Observable<any> {
    this.studentService.getOnlineCourseCredits().subscribe((data: any) => {
      let ruleData = data;

      const newData = [];
      newData.push({
        index: 7,
        rule: 'Atmost 8 credits of online courses',
        status: ruleData.isCompleteText,
        statusBool: ruleData.isCompleteBool,
        credits: ruleData.data.totalCredits,
        button_text: 'View Online Courses',
      });
      this.courseData.set('Online_Courses', ruleData.data.courses);
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
    return of(null);
  }

  populate32Credits(): Observable<any> {
    this.studentService.get32Credits().subscribe((data: any) => {
      let ruleData = data;

      const newData = [];
      newData.push({
        index: 5,
        rule: '32 Credits of CSE Courses',
        status: ruleData.isCompleteText,
        statusBool: ruleData.isCompleteBool,
        credits: ruleData.data.totalCredits,
        button_text: 'View CSE Courses',
      });

      this.courseData.set('32Credits_Courses', ruleData.data.courseData);
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
    return of(null);
  }

  populateIncompleteGrades(): Observable<any> {
    this.studentService.getIncompleteGrade().subscribe((data: any) => {
      let ruleData = data;

      const newData = [];
      newData.push({
        index: 12,
        rule: 'Incomplete Grade on Transcript',
        status: ruleData.isCompleteText,
        statusBool: ruleData.isCompleteBool,
        credits: ruleData.data.totalCredits,
        button_text: 'View Details',
      });

      this.courseData.set('Incomplete_Grades', ruleData.data.courseData);
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
    return of(null);
  }

  populateHonors(): Observable<any> {
    this.studentService.getHonors().subscribe((data: any) => {
      let ruleData = data;

      const newData = [];
      newData.push({
        index: 11,
        rule: 'Honors',
        status: ruleData.isCompleteText,
        statusBool: ruleData.isCompleteBool,
        credits: ruleData.data[1].value,
        button_text: 'View Details',
      });
      this.courseData.set('Honors', ruleData.data);
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
    return of(null);
  }

  populateTOCCredits(): Observable<any> {
    this.studentService.getTOCCredits().subscribe((data: any) => {
      let ruleData = data;

      const newData = [];
      newData.push({
        index: 9,
        rule: 'TOC / Maths of 200 level or above',
        status: ruleData.isCompleteText,
        statusBool: ruleData.isCompleteBool,
        credits: ruleData.data.totalCredits,
        button_text: 'View Details',
      });

      this.courseData.set('TOC', ruleData.data.courses);

      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
    return of(null);
  }

  // Add this function to navigate to different pages based on the row data
  navigateToPage(element: any): void {
    // Example: Navigate to a page based on the 'rule' property
    switch (element.rule) {
      case 'Core Courses':
        let coreCourses = this.courseData.get('Core_Courses');
        let bucketCourses = this.courseData.get('Bucket_Courses');
        this.router.navigate(['/core-courses-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            coreCourseData: JSON.stringify(coreCourses),
            bucketCourseData: JSON.stringify(bucketCourses),
            completedBuckets: JSON.stringify(this.completedBuckets),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
      case '12 credits of SSH courses':
        let sshCourses = this.courseData.get('SSH_Courses');
        this.router.navigate(['/ssh-courses-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(sshCourses),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
      case '2 credits of Community Work':
        let cwDetails = this.courseData.get('CW_Details');
        this.router.navigate(['/cw-details'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(cwDetails),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
      case '2 credits of Self Growth':
        let sgDetails = this.courseData.get('SG_Details');
        this.router.navigate(['/sg-details'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(sgDetails),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
      case 'BTP':
        let btpDetails = this.courseData.get('BTP_Details');
        this.router.navigate(['/btp-details'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(btpDetails),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
      case 'Atmost two 2xx level courses':
        let twoxxCourses = this.courseData.get('2XX_Courses');
        this.router.navigate(['/twoxx-courses-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(twoxxCourses),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
      case 'Atmost 8 credits of IP/IS/UR':
        let ipDetails = this.courseData.get('IP_Details');
        this.router.navigate(['/ip-details'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(ipDetails),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
      case '32 Credits of CSE Courses':
        let thirtyCreditCourses = this.courseData.get('32Credits_Courses');
        this.router.navigate(['/branch-courses-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(thirtyCreditCourses),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
      case 'Atmost 8 credits of online courses':
        let onlineCourses = this.courseData.get('Online_Courses');
        this.router.navigate(['/online-courses-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(onlineCourses),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
      case 'Incomplete Grade on Transcript':
        let incompleteGrades = this.courseData.get('Incomplete_Grades');
        this.router.navigate(['/incomplete-grades-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(incompleteGrades),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
      case 'Honors':
        let honors = this.courseData.get('Honors');
        this.router.navigate(['/honors'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(honors),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
      case 'TOC / Maths of 200 level or above':
        let tocCourses = this.courseData.get('TOC');
        this.router.navigate(['/toc-mth'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(tocCourses),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
    }
  }
}
