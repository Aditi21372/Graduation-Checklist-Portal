import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../student-service.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {

  username: string = ''; // Variables for input fields
  password: string = '';
  responseMessage: string = '';

  constructor(
    private studentService: StudentServiceService,
    private router: Router
  ) {}

  onLogin() {
    this.studentService.login(this.username, this.password).subscribe(
      (response) => {
        // Handle the response from the backend, e.g., redirect to another page;
        this.router.navigate(['/selection']);
      },
      (error) => {
        // Handle any errors, e.g., display an error message
        this.responseMessage = "The password that you've entered is incorrect.";
      }
    );
  }
}
