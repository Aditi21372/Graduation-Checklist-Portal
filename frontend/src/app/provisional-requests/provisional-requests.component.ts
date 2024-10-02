import { Component } from '@angular/core';
import { StudentServiceService } from '../student-service.service';
import { Router } from '@angular/router';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-provisional-requests',
  templateUrl: './provisional-requests.component.html',
  styleUrls: ['./provisional-requests.component.css'],
})
export class ProvisionalRequestsComponent {
  requests: any;
  showData: boolean = false;
  rn: string = '';

  constructor(
    private studentService: StudentServiceService,
    private router: Router,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.studentService.getProvisionalRequests().subscribe((data: any) => {
      // Assuming the response JSON contains 'requests' field
      this.showData = true;
      this.requests = data.sort((a: any, b: any) =>
        this.utilityService.customSort(a.rollNumber, b.rollNumber)
      );
    });
  }

  goBack() {
    this.router.navigate(['/selection']);
  }

  acceptRequest(rollNumber: string) {
    this.rn = rollNumber;
    this.router.navigate(['/provisional-certificate', this.rn]);
  }
}
