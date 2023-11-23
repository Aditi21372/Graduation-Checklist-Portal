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
  completedSGCWCredits: string = 'No';
  completedSSHCredits: string = 'No';
  completedBTPCredits: string = 'No';
  completedDepartmental32Credits: string = 'No';
  graduatingWithHonors: string = 'No';
  graduatingWithMinors: string = 'No';
  minorsStream: string = 'None';
  studentName: string = "";
  program: string = "";

  constructor(
    private studentService: StudentServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the rollNumber parameter from the route
    this.route.queryParams.subscribe((params) => {
      this.rollNumber = params["rollNumber"];
      this.program = params["program"];
      this.studentName = params["studentName"];

      // Create an array of observables for each API call
      const observables = [
        this.studentService.getGraduationStatus(this.rollNumber),
        this.studentService.getRequiredCredits(this.rollNumber),
        this.studentService.getSemWiseCGPA(this.rollNumber),
        this.studentService.getSGcourses(this.rollNumber),
        this.studentService.getCWcourses(this.rollNumber),
        this.studentService.getSSHcourses(this.rollNumber),
        this.studentService.getBTPCredits(this.rollNumber),
        this.studentService.get32Credits(this.rollNumber),
        this.studentService.getHonors(this.rollNumber),
      ];

      // Use forkJoin to wait for all observables to complete
      forkJoin(observables).subscribe(
        (results: any[]) => {
          // Destructure the results and assign values to corresponding variables
          const [
            gradStatus,
            requiredCredits,
            gpa,
            sgCourses,
            cwCourses,
            sshCourses,
            btpCredits,
            credits32,
            honors,
          ] = results;
          this.isGraduating = gradStatus ? 'Yes' : 'No';
          this.totalCreditsCompleted = requiredCredits.data;
          this.dataSourceTwo = [
            {
              requirement: 'Is the student graduating?',
              status: this.isGraduating,
            },
            {
              requirement: 'Total credits completed',
              status: this.totalCreditsCompleted,
            },
            {
              requirement: 'Final CGPA',
              status: gpa["10"].cgpa, 
            },
            {
              requirement: 'Completed SG / CW credits',
              status:
                sgCourses.isCompleteBool && cwCourses.isCompleteBool ? 'Yes' : 'No',
            },
            {
              requirement: 'Completed SSH credits',
              status: sshCourses.isCompleteBool ? 'Yes' : 'No',
            },
            {
              requirement: 'Completed BTP credits',
              status: btpCredits.isCompleteBool ? 'Yes' : 'No',
            },
            {
              requirement: 'Completed Departmental 32 Credits',
              status: credits32.isCompleteBool ? 'Yes' : 'No',
            },
            {
              requirement: 'Graduating with Honors',
              status: honors ? 'Yes' : 'No', 
            },
            {
              requirement: 'Graduating with Minors',
              status: 'No', // TODO
            },
            {
              requirement: 'Stream of Minors',
              status: 'None', // TODO
            },
          ];
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    });
  }

  goBack() {
    this.router.navigate(['/dashboard', this.rollNumber]);
  }
}
