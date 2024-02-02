import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css'],
})
export class SelectionComponent {
  constructor(private router: Router) {}

  updateStudentGrade() {
    this.router.navigate(['/update-student-grade']);
  }

  updateCourseDatabase() {}

  updateStudentDatabase() {
    this.router.navigate(['/update-student-database']);
  }

  // Function to handle checking the graduation checklist
  checkGraduationChecklist() {
    this.router.navigate(['/student-info-input']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
