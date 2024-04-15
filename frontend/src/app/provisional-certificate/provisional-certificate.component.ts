import { Component } from '@angular/core';
import { StudentServiceService } from '../student-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-provisional-certificate',
  templateUrl: './provisional-certificate.component.html',
  styleUrls: ['./provisional-certificate.component.css']
})
export class ProvisionalCertificateComponent {
  data = {
    fileNumber: 'IIITD/ACAD/PC/01/2024/',
    date: new Date(Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    prefix: 'Mr.',
    fullName: 'John Doe',
    rollNo: '123456',
    programSpecialization: 'Computer Science',
    branch: 'CSE'
  };
  rollNumber: string = '';

  constructor(private studentService: StudentServiceService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.rollNumber = params['rollNumber'];
      console.log(this.rollNumber);
    });

    this.studentService.acceptProvisionalRequest(this.rollNumber).subscribe((response) => {
      // data = data;
      console.log(response);
      this.data.fullName = response['Full Name'];
      this.data.rollNo = this.rollNumber;
      this.data.programSpecialization = response['program Specialization'];
      this.data.branch = response.branch;
      this.data.prefix = response.Prefix;

    });
  }

}
