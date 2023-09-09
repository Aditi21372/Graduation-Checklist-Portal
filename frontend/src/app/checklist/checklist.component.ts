import { Component } from '@angular/core';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent {
// Define data for the checklist
checklistData = [
  {
    title: 'CSE Graduation Checklist-2019 Batch',
    subtitle: 'This is the main title',
    rollNo: '2018092',
    name: 'SANDEEP KUMAR',
    rules: [
      {
        ruleName: 'Rule One',
        items: [
          { course: 'CSE101', status: 'Done', credits: 4 },
          { course: 'ECE111', status: 'Done', credits: 4 },
          // ... Add more course items
        ]
      },
      // ... Add more rules
    ]
  },
  // ... Add more checklist sections
];

}
