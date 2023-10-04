import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-student-info-input",
  templateUrl: "./student-info-input.component.html",
  styleUrls: ["./student-info-input.component.css"],
})
export class StudentInfoInputComponent {
  studentRollNumber: number = 0;
  showContent: boolean = true;
  constructor(private router: Router) {}

  onSubmit() {
    this.showContent = false;
    this.router.navigate(["/dashboard", this.studentRollNumber]);
  }
}
