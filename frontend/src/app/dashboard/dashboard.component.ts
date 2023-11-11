import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  rollNumber: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Get the rollNumber parameter from the route
    this.route.params.subscribe((params) => {
      this.rollNumber = params['rollNumber'];
    });
  }

  goBack() {
    this.router.navigate(['/student-info-input']);
  }
}
