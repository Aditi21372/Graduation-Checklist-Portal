import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';
import { UtilityService } from '../utility.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sem-leave',
  templateUrl: './sem-leave.component.html',
  styleUrls: ['./sem-leave.component.css']
})
export class SemLeaveComponent {

  showMessage: string = '';
  studentRollNumber: string = '';
  success: boolean = false;
  selectedCourse: boolean = false;
  data: any = [];
  selectedCourseIndex: number | null = null;

  constructor(
    private router: Router,
    private studentService: StudentServiceService,
    private utilityService: UtilityService,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    if (
      this.studentRollNumber === ''
    ) {
      this.showMessage = 'Please fill Roll Number';
    } else {
      this.studentService
          .getBtpForSemLeave(this.studentRollNumber)
          .subscribe(
            (response) => {
              this.success = true;
              this.data = response.sort((a: any, b: any) =>
                this.utilityService.customSort(
                  a['Batch / Term Code'],
                  b['Batch / Term Code']
                )
              );
              this.success = true;
              this.showMessage = '';
            },
            (error) => {
              this.showMessage = error.error.error;
              this.success = false;
            }
          );
        }
  }

  submitSelection() {
    if (this.selectedCourseIndex === null) {
      return;
    }
    this.selectedCourse = true;

    this.studentService
      .updateBtp(this.data[this.selectedCourseIndex], Number(this.studentRollNumber))
      .subscribe(
        (response) => {
          this.snackBar
            .open('Updated BTP details', '', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            })
            .afterDismissed()
            .subscribe(() => {
              this.ngOnInit();
            });
        },
        (error) => {
          this.snackBar
            .open('Error in updating minors details', '', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            })
            .afterDismissed()
            .subscribe(() => {
              // Call ngOnInit after snackbar is dismissed
              this.ngOnInit();
            });
        }
      );
  }

  ngOnInit() {
    this.showMessage = '';
    this.studentRollNumber = '';
    this.success = false;
    this.selectedCourse = false;
    this.data = [];
    this.selectedCourseIndex = null;
  }

  goBack() {
    this.router.navigate(['/selection']);
  }
}
