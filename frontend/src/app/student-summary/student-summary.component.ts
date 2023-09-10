import { Component } from '@angular/core';

@Component({
  selector: 'app-student-summary',
  templateUrl: './student-summary.component.html',
  styleUrls: ['./student-summary.component.css']
})
export class StudentSummaryComponent {
  displayedColumns: string[] = ['column1', 'column2'];
  dataSource = [
    'Is the student Graduating',
    'Total Credits Completed',
    'Final CGPA',
    'Completed SG / CW Credits',
    'Completed SSH Credits',
    'Completed BTP Credits',
    'Completed Departmental 32 Credits',
    'Graduating with Honors',
    'Graduating with Minors',
    'Mention the stream of Minors',
  ];
}
