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
    console.log('File change event triggered');
    this.errorMessage = '';
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      console.log('Selected file:', file);
      const fileNameParts = file.name.split('.');
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (fileExtension === 'xls' || fileExtension === 'xlsx') {
        this.selectedFile = file;
      } else {
        this.errorMessage = 'Please select a valid xlsx file.';
        event.target.value = null;
      }
    }
  }

  uploadFile() {
    console.log('Upload file method triggered');
    if (this.selectedFile && this.selectedFile.size > 0) {
      this.errorMessage = '';
      this.studentService
        .uploadStudentsDetailsFile(this.selectedFile)
        .subscribe(
          (event) => {
            if (event.type === HttpEventType.Sent) {
              this.progress = 0;
            }

            if (event.type === HttpEventType.Response) {
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

  downloadFileFormat() {
    const fileUrl = 'assets/studentdata_format.xlsx'; // Use relative path to assets folder
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'studentdata_format.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  testFunction() {
    console.log('Test button clicked');
  }

  goBack() {
    this.router.navigate(['/selection']);
  }
}
