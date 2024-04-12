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

  updateStudentDetails() {
    this.router.navigate(['/update-student-details']);
  }

  updateCourseDatabase() {
    this.router.navigate(['/update-course-database']);
  }

  updateStudentDatabase() {
    this.router.navigate(['/update-student-database']);
  }

  // Function to handle checking the graduation checklist
  checkGraduationChecklist() {
    this.router.navigate(['/student-info-input']);
  }

  showSummary(){
    this.router.navigate(['/students-summary']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  includeIp(){
    this.router.navigate(['/update-minors']);
  }

  semLeave(){
    this.router.navigate(['/sem-leave']);
  }
}
