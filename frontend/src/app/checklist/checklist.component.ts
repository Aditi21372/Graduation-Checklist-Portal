import { Component, OnInit, Input } from '@angular/core';
import { StudentServiceService } from '../student-service.service';
import { Router } from '@angular/router';
import { forkJoin, Observable, of, map } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as XLSX from 'xlsx';
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
          this.populateMandatory(1),
          this.populateSSHRule(2),
          this.populateCW(3),
          this.populateSG(4),
          this.populateExtraCourses(5),
          this.populateIPCredits(6),
          this.populateOnlineCourseCredits(7),
          this.populateTwoXXCredits(8),
          this.populateBTP(9),
          this.populateHonors(10),
          this.populateMinors(11),
          this.populateEcoMajors(16),
          this.populateIncompleteGrades(17),
          this.populateTotalCredits(18),
        ];
    

        forkJoin(observables).subscribe(() => {
          this.dataSourceTwo.sort((a, b) => a.index - b.index);
          console.log('dataSourceTwo:', this.dataSourceTwo);
        });
        
      });
  }
  

  saveDataToFile() {
  // Log dataSourceTwo to check its content
  console.log('dataSourceTwo:', this.dataSourceTwo);

  // Prepare the headers
  const headers = ['Student Name', 'Roll Number'];
  
  // Add course details headers dynamically based on the number of courses
  this.dataSourceTwo.forEach((entry, index) => {
    headers.push(`Course ${index + 1} Rule`, `Course ${index + 1} Credits`, `Course ${index + 1} Status`);
  });

  // Prepare the row data (student name, roll number, and all course details in the same row)
  const rowData = [
    this.studentName, 
    this.rollNumber,
    ...this.dataSourceTwo.flatMap(entry => [entry.rule, entry.credits, entry.status]) // Flattening the course details into the same row
  ];

  // Combine the headers and rowData into a 2D array for the sheet
  const data = [
    headers, // First row will be headers
    rowData  // Second row will be the actual data
  ];

  // Create a new worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Data');

  // Write the workbook and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  // Create a link element to download the Excel file
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${this.rollNumber}.xlsx`;

  // Trigger the download by clicking the link
  link.click();

  // Clean up the URL after download
  window.URL.revokeObjectURL(link.href);
}


  setGraduationStatus() {
    this.studentService
      .getGraduationStatus(this.branch)
      .subscribe((data: any) => {
        this.studentService.setGraduationStatus(data);
      });
  }

  populateMandatory(index: number): Observable<any> {
    return this.studentService.getMandatoryCourses(this.branch).pipe(
      map((ruleData: any) => {
        let status =
          ruleData.isCompleteBool && this.bucketStatus
            ? 'Complete'
            : 'Incomplete';

        const newData = {
          index: index,
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
        
        this.courseData.set(
          'Bucket_Courses',
          ruleData.data.studentBucketCourses
        );
        this.bucketCredits = ruleData.data.totalCredits;
        this.bucketStatus = ruleData.isCompleteBool;
        this.completedBuckets = ruleData.data.completedBuckets;
        this.bucketsRuleCompleted = ruleData.isCompleteText;
      });
    return of(null);
  }

  populateSSHRule(index: number): Observable<any> {
    if (this.branch === 'CSSS') {
      return this.populateSSHMajor(index);
    }
    return this.populateSSH(index);
  }

  populateSSH(index: number): Observable<any> {
    return this.studentService.getSSHcourses(this.branch).pipe(
      map((ruleData: any) => {
        const newData = {
          index: index,
          rule:
            this.branch != 'CSD'
              ? '12 credits of SSH courses'
              : '16 credits of SSH courses',
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


  populateSSHMajor(index: number): Observable<any> {
    return this.studentService.getSSHMajor().pipe(
      map((ruleData: any) => {
        const newData = {
          index: index,
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

  populateCW(index: number): Observable<any> {
    return this.studentService.getCWcourses().pipe(
      map((ruleData: any) => {
        const newData = {
          index: index,
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

  populateSG(index: number): Observable<any> {
    return this.studentService.getSGcourses().pipe(
      map((ruleData: any) => {
        const newData = {
          index: index,
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

  populateExtraCourses(index: number): Observable<any> {
    if (this.branch === 'CSAI') {
      return this.populateCsaiCourses(index);
    } else {
      return this.populate32Credits(index);
    }
  }

  populate32Credits(index: number): Observable<any> {
    return this.studentService.get32Credits(this.branch).pipe(
      map((ruleData: any) => {
        const newData = {
          index: index,
          rule: '32 Credits of Discipline Courses',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View Courses',
        };

        if (this.branch === 'CSSS') {
          newData.rule = '16 Credits of CSE Courses';
        }
        // if (this.branch === 'EVE') {
        //   newData.rule = '16 Credits of EVE Courses';
        // }

        this.courseData.set('32Credits_Courses', ruleData.data.courseData);
        this.dataSourceTwo.push(newData);
        return null;
      })
    );
  }

  populateCsaiCourses(index: number): Observable<any> {
    return this.studentService.getCsai().pipe(
      map((ruleData: any) => {
        const newData = {
          index: index,
          rule: 'AI Core & Application Courses',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.totalCredits,
          button_text: 'View Courses',
        };
        this.courseData.set('csaiCourses', ruleData.courses);
        this.dataSourceTwo.push(newData);
      })
    );
  }

  populateIPCredits(index: number): Observable<any> {
    return this.studentService.getIPCredits().pipe(
      map((ruleData: any) => {
        const newData = {
          index: index,
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

  populateOnlineCourseCredits(index: number): Observable<any> {
    return this.studentService.getOnlineCourseCredits().pipe(
      map((ruleData: any) => {
        const newData = {
          index: index,
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

  populateTwoXXCredits(index: number): Observable<any> {
    return this.studentService.getTwoXXCredits(this.branch).pipe(
      map((ruleData: any) => {
        const newData = {
          index: index,
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

  populateBTP(index: number): Observable<any> {
    return this.studentService.getBTPCredits().pipe(
      map((ruleData: any) => {
        const newData = {
          index: index,
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

  populateHonors(index: number): Observable<any> {
    return this.studentService.getHonors(this.branch).pipe(
      map((ruleData: any) => {
        const newData = {
          index: index,
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

  populateMinors(index: number): Observable<any> {
    console.log('Minorsss:', this.courseData);
    return this.studentService.getMinors().pipe(
      map((courseData: any) => {
        let finalNumber = 0;
        for (let i = 0; i < courseData.length; i++) {
          let newData = {
            index: index,
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

          // Special handling for Quantum minors
          if (courseData[i].data.stream === 'Quantum') {
            newData.rule = 'Minors in Quantum Technologies';
          }

          console.log('Course Data:', courseData[i].data.stream);

          courseData[i].data['credits'] = courseData[i].totalCredits;
          this.courseData.set(courseData[i].data.stream, courseData[i].data);
          this.dataSourceTwo.push(newData);
          finalNumber = newData.index;
        }
        return finalNumber;
      })
    );
  }

  populateEcoMajors(index: number): Observable<any> {
    return this.studentService.getEcoMajorCore().pipe(
      mergeMap((ruleData: any) => {
        
        const newData = {
          index: index,
          rule: 'ECO Major',
          status: ruleData.isCompleteText,
          statusBool: ruleData.isCompleteBool,
          credits: ruleData.data.totalCredits,
          button_text: 'View Courses',
        };

        return this.studentService.getEcoMajorElective().pipe(
          map((coursesData: any) => {
            if (this.branch != 'CSSS'){
              return index;
            }
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
  

  populateIncompleteGrades(index: number): Observable<any> {
    return this.studentService.getIncompleteGrade().pipe(
      map((ruleData: any) => {
        const newData = {
          index: this.branch == 'CSSS'? index : index - 1,
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

  populateTotalCredits(index: number): Observable<any> {
    return this.studentService.getRequiredCredits().pipe(
      map((ruleData: any) => {
        const newData = {
          index: this.branch == 'CSSS'? index : index - 1,
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
      case '16 credits of SSH courses':
        let sshCoursesCSD = this.courseData.get('SSH_Courses');
        this.router.navigate(['/ssh-courses-list'], {
          queryParams: {
            rollNumber: this.rollNumber,
            courseData: JSON.stringify(sshCoursesCSD),
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
        let aiCourses = this.courseData.get('csaiCourses');

        this.router.navigate(['/ai-courses'], {
          queryParams: {
            rollNumber: this.rollNumber,
            aiCourses: JSON.stringify(aiCourses),
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
        case 'Minors in Quantum Technologies':
          // console.log('Quantum:', this.courseData);
          // console.log(this.courseData);
          let minorsQuantum = this.courseData.get('Quantum Technologies');
          this.router.navigate(['/minors-detail'], {
            queryParams: {
              rollNumber: this.rollNumber,
              stream: "Quantum",
              courseData: JSON.stringify(minorsQuantum),
              studentName: this.studentName,
              program: this.branch,
            },
          });
          break;
        case 'Minors in Design':
          let minorsDesign = this.courseData.get('Design');
          this.router.navigate(['/minors-detail'], {
            queryParams: {
              rollNumber: this.rollNumber,
              stream: "Design",
              courseData: JSON.stringify(minorsDesign),
              studentName: this.studentName,
              program: this.branch,
            },
          });
          break;
    }
  }
}