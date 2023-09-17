import { Component } from '@angular/core';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css'],
})
export class ChecklistComponent {
  displayedColumns: string[] = ['course', 'status', 'credits'];

  dataSource = [
    { course: 'Course 1', status: 'In Progress', credits: 3 },
    { course: 'Course 2', status: 'In Progress', credits: 4 },
    // Add more data as needed
  ];
}
