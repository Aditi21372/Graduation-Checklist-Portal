import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css'],
})
export class SelectionComponent {
  constructor(private router: Router) {}

  updateDatabase() {
    this.router.navigate(['/update-student-database']);
  }

  // Function to handle checking the graduation checklist
  checkGraduationChecklist() {
    this.router.navigate(['/student-info-input']);
  }
}
