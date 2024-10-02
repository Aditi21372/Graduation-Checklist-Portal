import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';

@Component({
  selector: 'app-students-summary',
  templateUrl: './students-summary.component.html',
  styleUrls: ['./students-summary.component.css'],
})
export class StudentsSummaryComponent {
  batch: String = '';
  showMessage: string = '';
  showContent: boolean = false;
  studentDataArray: any;
  processing: string = '';

  constructor(
    private router: Router,
    private studentService: StudentServiceService
  ) {}

  ngOnInit(): void {
    this.showMessage = '';
  }

  processSummary() {
    this.processing = 'Processing';
    this.studentService.generateSummary().subscribe((data) => {
      this.processing = 'Processed';
      setTimeout(() => {
        this.processing = '';
      }, 5000);
    });
  }

  onSubmit() {
    this.studentService.getSummary(Number(this.batch)).subscribe(
      (data: any[]) => {
        this.showContent = true;
        this.showMessage = '';
        this.studentDataArray = data;
        this.studentDataArray.sort(
          (a: any, b: any) => a['Roll Number'] - b['Roll Number']
        );
      },
      (error) => {
        this.showMessage = '';
        this.showContent = false;
        this.showMessage = 'Summary exist in the database!';
      }
    );
  }

  goBack() {
    this.router.navigate(['/selection']);
  }

  downloadTable() {
    this.studentService.donwloadSummary(Number(this.batch)).subscribe((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'studentSummary.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
