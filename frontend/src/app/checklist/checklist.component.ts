import { Component, OnInit, Input } from '@angular/core';
import { StudentServiceService } from '../student-service.service';
import { Router } from '@angular/router';
import { forkJoin, Observable, of, map } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css'],
})
export class ChecklistComponent implements OnInit {
  @Input() rollNumber: number = 0;

  branch: string = '';
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
        this.studentName = studentData['Name'];
        this.branch = studentData.branch;
        this.setGraduationStatus();

        const observables = [
          this.populateBuckets(),
          this.populateMandatory(),
          this.populateSSHRule(),
          this.populateCW(),
          this.populateSG(),
          this.populateExtraCourses(),
          this.populateIPCredits(),
          this.populateOnlineCourseCredits(),
          this.populateTwoXXCredits(),
          this.populateBTP(),
          this.populateHonors(),
          this.populateMinors(),
          this.populateEcoMajors(),
          this.populateIncompleteGrades(),
          this.populateTotalCredits(),
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

  populateSSHRule(): Observable<any> {
    if (this.branch === 'CSSS') {
      return this.populateSSHMajor();
    }
    return this.populateSSH();
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

  populateSSHMajor(): Observable<any> {
    return this.studentService.getSSHMajor().pipe(
      map((ruleData: any) => {
        const newData = {
          index: 2,
          rule: '28 credits of SSH courses',
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

  populateExtraCourses(): Observable<any> {
    if (this.branch === 'CSAI') {
      return this.populateCsaiCourses();
    } else {
      return this.populate32Credits();
    }
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

        if (this.branch === 'CSSS') {
          newData.rule = '16 Credits of CSE Courses';
        }

        this.courseData.set('32Credits_Courses', ruleData.data.courseData);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
  }

  populateCsaiCourses(): Observable<any> {
    return this.studentService.getCsaiCore().pipe(
      mergeMap((ruleData: any) => {
        const newData = {
          index: 5,
          rule: 'AI Core & Application Courses',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View Courses',
        };

        return this.studentService.getCsaiApplication().pipe(
          map((coursesData: any) => {
            newData.credits += coursesData.data.totalCredits;
            newData.statusBool =
              ruleData.isCompleteBool && coursesData.isCompleteBool;
            newData.status = newData.statusBool ? 'Complete' : 'Incomplete';
            this.courseData.set('csaiCourses', [
              ruleData.data,
              coursesData.data,
            ]);
            this.dataSourceTwo.push(newData);
            return null;
          })
        );
      })
    );
  }

  populateEcoMajors(): Observable<any> {
    return this.studentService.getEcoMajorCore().pipe(
      mergeMap((ruleData: any) => {
        const newData = {
          index: 14,
          rule: 'ECO Major',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View Courses',
        };

        return this.studentService.getEcoMajorElective().pipe(
          map((coursesData: any) => {
            newData.credits += coursesData.data.totalCredits;
            newData.statusBool =
              ruleData.isCompleteBool && coursesData.isCompleteBool;
            newData.status = newData.statusBool ? 'Complete' : 'Not Done';
            this.courseData.set('ecoMajorCourses', [
              ruleData.data,
              coursesData.data,
            ]);
            this.dataSourceTwo.push(newData);
            return null;
          })
        );
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
          let newData = {
            index: 11,
            rule: 'Minors in ',
            status: 'Not Done',
            statusBool: true,
            credits: 0,
            button_text: 'View Details',
          };

          newData.index += i;
          newData.rule += courseData[i].data.stream;
          newData.credits = courseData[i].totalCredits;
          newData.status = courseData[i].isCompleteText;

          courseData[i].data['credits'] = courseData[i].totalCredits;
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
          index: 15,
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

  populateTotalCredits(): Observable<any> {
    return this.studentService.getRequiredCredits().pipe(
      map((ruleData: any) => {
        const newData = {
          index: 16,
          rule: 'Total Credits',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data,
          button_text: 'No Action',
        };

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
            coreCourseData: JSON.stringify(coreCourses),
            bucketCourseData: JSON.stringify(bucketCourses),
            completedBuckets: JSON.stringify(this.completedBuckets),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case '12 credits of SSH courses':
        let sshCourses = this.courseData.get('SSH_Courses');
        this.router.navigate(['/ssh-courses-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(sshCourses),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case '28 credits of SSH courses':
        let sshMajorCourses = this.courseData.get('SSH_Courses');
        this.router.navigate(['/ssh-courses-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(sshMajorCourses),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case '2 credits of Community Work':
        let cwDetails = this.courseData.get('CW_Details');
        this.router.navigate(['/cw-details'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(cwDetails),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case '2 credits of Self Growth':
        let sgDetails = this.courseData.get('SG_Details');
        this.router.navigate(['/sg-details'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(sgDetails),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case 'BTP':
        let btpDetails = this.courseData.get('BTP_Details');
        this.router.navigate(['/btp-details'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(btpDetails),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case 'Atmost two 2xx level courses':
        let twoxxCourses = this.courseData.get('2XX_Courses');
        this.router.navigate(['/twoxx-courses-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(twoxxCourses),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case 'Atmost 8 credits of IP/IS/UR':
        let ipDetails = this.courseData.get('IP_Details');
        this.router.navigate(['/ip-details'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(ipDetails),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case '32 Credits of Discipline Courses':
        let thirtyCreditCourses = this.courseData.get('32Credits_Courses');
        this.router.navigate(['/branch-courses-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(thirtyCreditCourses),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case '16 Credits of CSE Courses':
        let sixteenCreditCourses = this.courseData.get('32Credits_Courses');
        this.router.navigate(['/branch-courses-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(sixteenCreditCourses),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case 'AI Core & Application Courses':
        let aiCoreCourses = this.courseData.get('csaiCourses')[0];
        let aiApplicationCourses = this.courseData.get('csaiCourses')[1];

        this.router.navigate(['/ai-courses'], {
          queryParams: {
            rollNumber: this.rollNumber,
            aiCoreCourses: JSON.stringify(aiCoreCourses),
            aiApplicationCourses: JSON.stringify(aiApplicationCourses),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case 'ECO Major':
        let ecoMajorCoreCourses = this.courseData.get('ecoMajorCourses')[0];
        let ecoMajorElectiveCourses = this.courseData.get('ecoMajorCourses')[1];

        this.router.navigate(['/csss-ecomajor'], {
          queryParams: {
            rollNumber: this.rollNumber,
            ecoMajorCoreCourses: JSON.stringify(ecoMajorCoreCourses),
            ecoMajorElectiveCourses: JSON.stringify(ecoMajorElectiveCourses),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case 'Atmost 8 credits of online courses':
        let onlineCourses = this.courseData.get('Online_Courses');
        this.router.navigate(['/online-courses-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(onlineCourses),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case 'Incomplete Grade on Transcript':
        let incompleteGrades = this.courseData.get('Incomplete_Grades');
        this.router.navigate(['/incomplete-grades-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(incompleteGrades),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case 'Honors':
        let honors = this.courseData.get('Honors');
        this.router.navigate(['/honors'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(honors),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case 'Minors in Computational Biology':
        let minorsBio = this.courseData.get('Computational Biology');
        this.router.navigate(['/minors-detail'], {
          queryParams: {
            rollNumber: this.rollNumber,
            stream: 'Computational Biology',
            courseData: JSON.stringify(minorsBio),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case 'Minors in Economics':
        let minorsEco = this.courseData.get('Economics');
        this.router.navigate(['/minors-detail'], {
          queryParams: {
            rollNumber: this.rollNumber,
            stream: 'Economics',
            courseData: JSON.stringify(minorsEco),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
      case 'Minors in Entrepreneurship':
        let minorsEnt = this.courseData.get('Entrepreneurship');
        this.router.navigate(['/minors-detail'], {
          queryParams: {
            rollNumber: this.rollNumber,
            stream: 'Entrepreneurship',
            courseData: JSON.stringify(minorsEnt),
            studentName: this.studentName,
            program: this.branch,
          },
        });
        break;
    }
  }
}
