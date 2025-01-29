import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = ''; // Variables for input fields
  password: string = '';
  responseMessage: string = '';

  constructor(
    private studentService: StudentServiceService,
    private router: Router
  ) {}

  onLogin() {
    this.studentService.studentLogin(this.username, this.password).subscribe(
      (response) => {
        // Handle the response from the backend, e.g., redirect to another page;
        this.router.navigate(['/dashboard', response]);
      },
      (error) => {
        // Handle any errors, e.g., display an error message
        this.responseMessage = "The password that you've entered is incorrect.";
      }
    );
  }

  onLoginAsStudent() {
    // Navigate to the student view
    this.router.navigate(['/student-view-checkList']);
  }
}
