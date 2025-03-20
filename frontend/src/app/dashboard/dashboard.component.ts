import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  rollNumber: number = 0;
  studentData: any = null;

  constructor(private route: ActivatedRoute, private router: Router, private studentService: StudentServiceService, private authService: AuthService) { }

  ngOnInit() {

    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/login']);
      return;
    }
    // Get the rollNumber parameter from the route
    this.route.params.subscribe((params) => {
      this.rollNumber = params['rollNumber'];
      this.loadStudentData();
    });
  }
  loadStudentData() {
    this.studentService.getStudentData(this.rollNumber.toString()).subscribe(
      (data) => {
        this.studentData = data;
      },
      (error) => {
        console.error('Error loading student data:', error);
        this.router.navigate(['/student-info-input']);
      }
    );
  }
  goBack() {
    this.router.navigate(['/student-info-input']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
