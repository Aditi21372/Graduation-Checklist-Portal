import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';
import { UtilityService } from '../utility.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-minors',
  templateUrl: './update-minors.component.html',
  styleUrls: ['./update-minors.component.css'],
})
export class UpdateMinorsComponent {
  showMessage: string = '';
  studentRollNumber: string = '';
  minors: string[] = ['Computational Biology', 'Economics', 'Entrepreneurship'];
  add: string[] = ['IP', 'BTP', 'Apprenticeship'];
  selectedMinors: string = '';
  selectedType: string = '';
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
      this.selectedMinors === '' ||
      this.selectedType === '' ||
      this.studentRollNumber === ''
    ) {
      this.showMessage = 'Please fill all the fields';
    } else {
      if (
        this.selectedType === 'Apprenticeship' &&
        this.selectedMinors != 'Entrepreneurship'
      ) {
        this.showMessage =
          'Apprenticeship can only be selected with Entrepreneurship';
      } else {
        this.studentService
          .updateStudentMinors(this.studentRollNumber, this.selectedType)
          .subscribe(
            (response) => {
              if (this.selectedType === 'Apprenticeship') {
                this.snackBar.open('Updated Apprenticeship details', '', {
                  duration: 5000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                });
                // Call ngOnInit after snackbar is dismissed
                this.ngOnInit();
                return;
              }
              this.success = true;
              this.data = response.sort((a: any, b: any) =>
                this.utilityService.customSort(
                  a['Batch / Term Code'],
                  b['Batch / Term Code']
                )
              );
              this.success = true;
            },
            (error) => {
              this.showMessage = error.error.message;
            }
          );
      }
    }
  }

  submitSelection() {
    if (this.selectedCourseIndex === null) {
      return;
    }
    this.selectedCourse = true;

    this.studentService
      .updateMinors(this.data[this.selectedCourseIndex], this.selectedMinors)
      .subscribe(
        (response) => {
          this.snackBar
            .open('Updated minors details', '', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            })
            .afterDismissed()
            .subscribe(() => {
              // Call ngOnInit after snackbar is dismissed
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
    this.selectedMinors = '';
    this.selectedType = '';
    this.success = false;
    this.selectedCourse = false;
    this.data = [];
    this.selectedCourseIndex = null;
  }

  goBack() {
    this.router.navigate(['/selection']);
  }
}
