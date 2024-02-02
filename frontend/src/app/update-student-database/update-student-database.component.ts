import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';
import { HttpProgressEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-update-student-database',
  templateUrl: './update-student-database.component.html',
  styleUrls: ['./update-student-database.component.css'],
})
export class UpdateStudentDatabaseComponent {
  selectedFile: File = new File([], '');
  errorMessage: string = '';
  progress: number = 0;

  constructor(
    private studentService: StudentServiceService,
    private router: Router
  ) {}

  onFileChange(event: any) {
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
      this.studentService.uploadFile(this.selectedFile).subscribe(
        (event) => {
          console.log(event.type, event.loaded, event.total);
          if (event.type === HttpEventType.Sent) {
            // HttpEventType.Sent - Request sent, initialize progress to 0
            this.progress = 0;
          }

          if (event.type === HttpEventType.Response) {
            // HttpEventType.Response - Upload completed successfully
            console.log('File uploaded successfully', event.body);
            this.errorMessage = 'File uploaded successfully';
          } else {
            this.errorMessage = 'Processing file...';
          }
        },
        (error) => {
          console.error('Error uploading file', error);
          this.errorMessage = 'Error uploading file. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Please select a file before uploading.';
    }
  }

  goBack() {
    this.router.navigate(['/selection']);
  }
}
