import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';
import { HttpProgressEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-update-student-details',
  templateUrl: './update-student-details.component.html',
  styleUrls: ['./update-student-details.component.css'],
})
export class UpdateStudentDetailsComponent {
  selectedFile: File = new File([], '');
  errorMessage: string = '';
  progress: number = 0;

  constructor(
    private studentService: StudentServiceService,
    private router: Router
  ) {}

  onFileChange(event: any) {
    this.errorMessage = '';
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const fileNameParts = file.name.split('.');
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (fileExtension === 'xls') {
        this.selectedFile = file;
      } else {
        this.errorMessage = 'Please select a valid xlsx file.';
        event.target.value = null;
      }
    }
  }

  uploadFile() {
    if (this.selectedFile && this.selectedFile.size > 0) {
      this.errorMessage = '';
      this.studentService
        .uploadStudentsDetailsFile(this.selectedFile)
        .subscribe(
          (event) => {
            if (event.type === HttpEventType.Sent) {
              // HttpEventType.Sent - Request sent, initialize progress to 0
              this.progress = 0;
            }

            if (event.type === HttpEventType.Response) {
              // HttpEventType.Response - Upload completed successfully
              this.errorMessage = 'File uploaded successfully';
            } else {
              this.errorMessage = 'Processing file...';
            }
          },
          (error) => {
            this.errorMessage = error.error.error;
          }
        );
    } else {
      this.errorMessage = 'Please select a file before uploading.';
    }
  }

  downloadData() {
    this.studentService.getStudentDetails().subscribe((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'studentsInfo.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
  

  goBack() {
    this.router.navigate(['/selection']);
  }
}
