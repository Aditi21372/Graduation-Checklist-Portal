import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  rollNumber: number = 0;
  gradStatus: string = ''; // Define gradStatus property

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Get the rollNumber parameter from the route
    this.route.params.subscribe((params) => {
      this.rollNumber = params['rollNumber'];
    });
  }

  // Adjust the method to handle a boolean and convert it to a string if necessary
  onGraduationStatusChanged(status: boolean): void {
    this.gradStatus = status.toString();
  }

  goBack() {
    this.router.navigate(['/student-info-input']);
  }
}
