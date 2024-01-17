import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-honors',
  templateUrl: './honors.component.html',
  styleUrls: ['./honors.component.css']
})
export class HonorsComponent {
  dataSource: MatTableDataSource<any>;
  rollNumber: number = 0;
  branch: string = '';
  program: string = '';
  studentName: string = '';
  courseData: any;
  displayedColumns: string[] = [
    'rule',
    'value',
    'status'
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.studentName = params['studentName'];
      this.program = params['program'];
      this.rollNumber = params['rollNumber'];
      this.branch = params['branch'];
      this.courseData = JSON.parse(params['courseData']);
      this.populateHonors();
    });
  }

  populateHonors() {
    const newData = [];
    for (let i = 0; i < this.courseData.length; i++) {
      newData.push({
        rule: this.courseData[i].rule,
        value: this.courseData[i].value,
        status: this.courseData[i].status
      });
    }

    this.dataSource.data = [...this.dataSource.data, ...newData];
  }

  goBack() {
    this.router.navigate(['/dashboard', this.rollNumber]);
  }

}
