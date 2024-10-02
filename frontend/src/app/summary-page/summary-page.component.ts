import { Component, OnInit } from '@angular/core';
import { StudentServiceService } from '../student-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.css'],
})
export class SummaryPageComponent implements OnInit {
  dataSourceTwo: any[] = [];
  displayedColumns: string[] = ['requirement', 'status'];
  rollNumber: number = 0;
  isGraduating: string = 'No';
  totalCreditsCompleted: number = 0;
  finalCGPA: number = 0;
  studentName: string = '';
  program: string = '';

  constructor(
    private studentService: StudentServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the rollNumber parameter from the route
    this.route.queryParams.subscribe((params) => {
      this.rollNumber = params['rollNumber'];
      this.program = params['program'];
      this.studentName = params['studentName'];

      // Create an array of observables for each API call
      const observables = [
        this.studentService.getGraduationStatus(this.program),
        this.studentService.getGraduationDate(this.program),
        this.studentService.getRequiredCredits(),
        this.studentService.getSemWiseCGPA(),
        this.studentService.getSGcourses(),
        this.studentService.getCWcourses(),
        this.studentService.getSSHcourses(this.program),
        this.studentService.getBTPCredits(),
        this.studentService.get32Credits(this.program),
        this.studentService.getHonors(this.program),
        this.studentService.getMinors(),
        this.studentService.getEcoMajorCore(),
        this.studentService.getEcoMajorElective(),
      ];

      // Use forkJoin to wait for all observables to complete
      forkJoin(observables).subscribe(
        (results: any[]) => {
          // Destructure the results and assign values to corresponding variables
          const [
            gradStatus,
            gradDate,
            requiredCredits,
            gpa,
            sgCourses,
            cwCourses,
            sshCourses,
            btpCredits,
            credits32,
            honors,
            minors,
            majorsCore,
            majorsElective,
          ] = results;
          this.isGraduating = gradStatus ? 'Yes' : 'No';
          this.totalCreditsCompleted = requiredCredits.data;
          const minorsStream = this.processMinors(minors);
          this.dataSourceTwo = [
            {
              requirement: 'Is the student graduating?',
              status: this.isGraduating,
            },
            {
              requirement: 'Graduation Date',
              status: gradDate,
            },
            {
              requirement: 'Total credits completed',
              status: this.totalCreditsCompleted,
            },
            {
              requirement: 'Final CGPA',
              status: gpa['10'].cgpa,
            },
            {
              requirement: 'Completed SG / CW credits',
              status:
                sgCourses.isCompleteBool && cwCourses.isCompleteBool
                  ? 'Yes'
                  : 'No',
            },
            {
              requirement: 'Completed SSH credits',
              status: sshCourses.isCompleteBool ? 'Yes' : 'No',
            },
            {
              requirement: 'Completed BTP credits',
              status: btpCredits.isCompleteText === 'Complete' ? 'Yes' : 'No',
            },
            {
              requirement: 'Completed Departmental 32 Credits',
              status: credits32.isCompleteBool ? 'Yes' : 'No',
            },
            {
              requirement: 'Graduating with Honors',
              status: honors.isCompleteText === 'Done' ? 'Yes' : 'No',
            },
            {
              requirement: 'Graduating with Minors',
              status: minorsStream.length > 0 ? 'Yes' : 'No',
            },
            {
              requirement: 'Stream of Minors',
              status:
                minorsStream.length > 0 ? minorsStream.join(', ') : 'None',
            },
            {
              requirement: 'Graduating with ECO Major',
              status:
                majorsCore.isCompleteBool && majorsElective.isCompleteBool
                  ? 'Yes'
                  : 'No',
            },
          ];
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    });
  }

  processMinors(minors: any) {
    const stream = [];
    for (let i = 0; i < minors.length; i++) {
      if (minors[i].isCompleteText === 'Complete') {
        stream.push(minors[i].data.stream);
      }
    }
    return stream;
  }

  printSummary() {
    window.print();
  }

  goBack() {
    this.router.navigate(['/dashboard', this.rollNumber]);
  }
}
