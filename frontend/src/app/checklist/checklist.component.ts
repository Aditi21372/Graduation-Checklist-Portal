import { Component, OnInit, Input } from '@angular/core';
import { StudentServiceService } from '../student-service.service';
import { Router } from '@angular/router';
import { forkJoin, Observable, of, map } from 'rxjs';

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
  dataSourceTwo: any[] = [];
  courseData: Map<string, any>;
  completedBuckets: any;
  bucketCredits: number = 0;
  bucketStatus: boolean = true;

  constructor(
    private studentService: StudentServiceService,
    private router: Router
  ) {
    this.courseData = new Map<string, any>();
  }

  ngOnInit() {
    this.studentService
      .getStudentCourseData(this.rollNumber.toString())
      .subscribe((studentData) => {
        this.program = studentData.branch;
        this.studentName = studentData.studentName;
        this.branch = this.program.slice(
          this.program.lastIndexOf('/') + 1,
          this.program.length
        );
        this.setGraduationStatus();

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
          this.populateBTP(),
          this.populateHonors(),
          this.populateMinors(),
          this.populateIncompleteGrades(),
        ];

        forkJoin(observables).subscribe(() => {
          this.dataSourceTwo.sort((a, b) => a.index - b.index);
        });
      });
  }

  setGraduationStatus() {
    this.studentService
      .getGraduationStatus(this.branch)
      .subscribe((data: any) => {
        this.studentService.setGraduationStatus(data);
      });
  }

  populateMandatory(): Observable<any> {
    return this.studentService.getMandatoryCourses(this.branch).pipe(
      map((ruleData: any) => {
        let status =
          ruleData.isCompleteBool && this.bucketStatus
            ? 'Complete'
            : 'Incomplete';

        const newData = {
          index: 1,
          rule: 'Core Courses',
          status: status,
          credits: ruleData.data.totalCredits + this.bucketCredits,
          button_text: 'View Core Courses',
        };
        this.courseData.set('Core_Courses', ruleData.data.coreCourses);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
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
        this.bucketCredits = ruleData.data.totalCredits;
        this.bucketStatus = ruleData.isCompleteBool;
        this.completedBuckets = ruleData.data.completedBuckets;
      });
    return of(null);
  }

  populateSSH(): Observable<any> {
    return this.studentService.getSSHcourses().pipe(
      map((ruleData: any) => {
        const newData = {
          index: 2,
          rule: '12 credits of SSH courses',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View SSH Courses',
        };

        this.courseData.set('SSH_Courses', ruleData.data.courses);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
  }

  populateCW(): Observable<any> {
    return this.studentService.getCWcourses().pipe(
      map((ruleData: any) => {
        const newData = {
          index: 3,
          rule: '2 credits of Community Work',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View Details',
        };

        this.courseData.set('CW_Details', ruleData.data.courses);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
  }

  populateSG(): Observable<any> {
    return this.studentService.getSGcourses().pipe(
      map((ruleData: any) => {
        const newData = {
          index: 4,
          rule: '2 credits of Self Growth',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View Details',
        };

        this.courseData.set('SG_Details', ruleData.data.courses);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
  }

  populate32Credits(): Observable<any> {
    return this.studentService.get32Credits(this.branch).pipe(
      map((ruleData: any) => {
        const newData = {
          index: 5,
          rule: '32 Credits of Discipline Courses',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View Courses',
        };

        this.courseData.set('32Credits_Courses', ruleData.data.courseData);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
  }

  populateIPCredits(): Observable<any> {
    return this.studentService.getIPCredits().pipe(
      map((ruleData: any) => {
        const newData = {
          index: 6,
          rule: 'Atmost 8 credits of IP/IS/UR',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View Details',
        };

        this.courseData.set('IP_Details', ruleData.data.courses);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
  }

  populateOnlineCourseCredits(): Observable<any> {
    return this.studentService.getOnlineCourseCredits().pipe(
      map((ruleData: any) => {
        const newData = {
          index: 7,
          rule: 'Atmost 8 credits of online courses',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View Online Courses',
        };

        this.courseData.set('Online_Courses', ruleData.data.courses);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
  }

  populateTwoXXCredits(): Observable<any> {
    return this.studentService.getTwoXXCredits(this.branch).pipe(
      map((ruleData: any) => {
        const newData = {
          index: 8,
          rule: 'Atmost two 2xx level courses',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View Courses',
        };

        this.courseData.set('2XX_Courses', ruleData.data.courses);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
  }

  populateBTP(): Observable<any> {
    return this.studentService.getBTPCredits().pipe(
      map((ruleData: any) => {
        const newData = {
          index: 9,
          rule: 'BTP',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View Details',
        };

        this.courseData.set('BTP_Details', ruleData.data.courses);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
  }

  populateHonors(): Observable<any> {
    return this.studentService.getHonors(this.branch).pipe(
      map((ruleData: any) => {
        const newData = {
          index: 10,
          rule: 'Honors',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data[1].value,
          button_text: 'View Details',
        };

        this.courseData.set('Honors', ruleData.data);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
  }

  populateMinors(): Observable<any> {
    return this.studentService.getMinors().pipe(
      map((courseData: any) => {
        for (let i = 0; i < courseData.length; i++) {
          let credits = 0;
          let newData = {
            index: 11,
            rule: 'Minors in ',
            status: 'Not Done',
            statusBool: true,
            credits: 0,
            button_text: 'View Details',
          };
          for (const course of courseData[i].data.coreCoursesCompleted.data) {
            credits += course.credits;
          }

          for (
            let j = 0;
            j < courseData[i].data.additionalCreditsCompleted.data.length;
            j++
          ) {
            credits +=
              courseData[i].data.additionalCreditsCompleted.data[j].credits;
          }
          newData.index += i;
          newData.rule += courseData[i].data.stream;
          newData.credits = credits;
          newData.status = courseData[i].isCompleteText;
          this.courseData.set(courseData[i].data.stream, courseData[i].data);
          this.dataSourceTwo.push(newData);
        }
        return null;
      })
    );
  }

  populateIncompleteGrades(): Observable<any> {
    return this.studentService.getIncompleteGrade().pipe(
      map((ruleData: any) => {
        const newData = {
          index: 13,
          rule: 'Incomplete Grade on Transcript',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View Details',
        };

        this.courseData.set('Incomplete_Grades', ruleData.data.courseData);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
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
      case '32 Credits of Discipline Courses':
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
      case 'Minors in Computational Biology':
        let minors = this.courseData.get('Computational Biology');
        this.router.navigate(['/minors-detail'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(minors),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
      case 'Minors in Economics':
        let minorsEco = this.courseData.get('Economics');
        this.router.navigate(['/minors-detail'], {
          queryParams: {
            rollNumber: this.rollNumber,
            branch: this.branch,
            courseData: JSON.stringify(minorsEco),
            studentName: this.studentName,
            program: this.program,
          },
        });
        break;
    }
  }
}
