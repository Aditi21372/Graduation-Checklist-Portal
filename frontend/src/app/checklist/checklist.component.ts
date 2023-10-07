import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentServiceService } from '../student-service.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css'],
})
export class ChecklistComponent implements OnInit {
  @Input() rollNumber: number = 0;
  branch: string = '';
  displayedColumns: string[] = ['course', 'status', 'credits', 'grade'];
  displayedColumn: string[] = ['rule', 'status', 'credits'];
  isTable1Expanded = true;
  isTable2Expanded = [true, true, true, true, true];
  completedMandatory = true;
  completedBuckets = [true, true, true, true, true];

  dataSource: MatTableDataSource<any>;
  dataSourceTwo: MatTableDataSource<any>;
  isChecklistVisible = false;
  tablesData: MatTableDataSource<any>[] = [];
  rules: any[] = [];

  constructor(private studentService: StudentServiceService) {
    this.dataSource = new MatTableDataSource();
    this.dataSourceTwo = new MatTableDataSource();
  }

  ngOnInit() {
    // // Call the service to fetch student data
    this.studentService
      .getStudentData(this.rollNumber.toString())
      .subscribe((data: any) => {
        this.branch = data.branch;
        this.populateMandatory();
        this.populateBuckets();
        this.populateSSH();
        this.populateCW();
        this.populateSG();
        this.populateBTP();
        this.populateTwoXXCredits();
        this.populateIPCredits();
        this.populateOnlineCourseCredits();
        this.populate32Credits();
      });
  }

  // Toggle function to expand/collapse panels
  toggleTable(tableNumber: number, i: number) {
    switch (tableNumber) {
      case 1:
        this.isTable1Expanded = !this.isTable1Expanded;
        break;
      case 2:
        this.isTable2Expanded[i] = !this.isTable2Expanded[i];
        break;
    }
  }

  populateMandatory() {
    this.branch = this.branch.slice(
      this.branch.lastIndexOf('/') + 1,
      this.branch.length
    );

    this.studentService
      .getMandatoryCourses(this.branch, this.rollNumber)
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource();
        let courseDetails = data;

        const newData = [];

        for (let i = 0; i < courseDetails.length; i++) {
          newData.push({
            course: courseDetails[i].course,
            status: courseDetails[i].status,
            credits: courseDetails[i].credits,
            grade: courseDetails[i].grade,
          });
          if (courseDetails[i].status !== 'Done') {
            this.completedMandatory = false;
          }
        }

        this.dataSource.data = [...this.dataSource.data, ...newData];
      });
  }

  populateBuckets() {
    this.studentService
      .getBucketCourses(this.branch, this.rollNumber)
      .subscribe((data: any) => {
        let courseBucketDetails = data;

        for (let i = 0; i < courseBucketDetails.length; i++) {
          const newData = [];
          let atleastOne = false;

          for (let j = 0; j < courseBucketDetails[i].length; j++) {
            newData.push({
              course: courseBucketDetails[i][j].course,
              status: courseBucketDetails[i][j].status,
              credits: courseBucketDetails[i][j].credits,
              grade: courseBucketDetails[i][j].grade,
            });

            if (courseBucketDetails[i][j].status === 'Done') {
              atleastOne = true;
            }
          }
          if(!atleastOne){
            this.completedBuckets[i] = false;
          }
          this.tablesData.push(new MatTableDataSource(newData));
        }
      });
  }

  populateSSH() {
    this.studentService
      .getSSHcourses(this.rollNumber)
      .subscribe((data: any) => {
        let courseBucketDetails = data;

        const newData = [];
        newData.push({
          rule: '12 credits of SSH courses',
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
        });
        this.rules.push(newData);
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populateCW() {
    this.studentService.getCWcourses(this.rollNumber).subscribe((data: any) => {
      let courseBucketDetails = data;

      const newData = [];
      newData.push({
        rule: '2 credits of Comunity Work',
        status: courseBucketDetails.status,
        credits: courseBucketDetails.credits,
      });
      this.rules.push(newData);
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  populateSG() {
    this.studentService.getSGcourses(this.rollNumber).subscribe((data: any) => {
      let courseBucketDetails = data;

      const newData = [];
      newData.push({
        rule: '2 credits of Self Growth',
        status: courseBucketDetails.status,
        credits: courseBucketDetails.credits,
      });
      this.rules.push(newData);
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  populateBTP() {
    this.studentService
      .getBTPCredits(this.rollNumber)
      .subscribe((data: any) => {
        let courseBucketDetails = data;

        const newData = [];
        newData.push({
          rule: 'BTP',
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
        });
        this.rules.push(newData);
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populateTwoXXCredits() {
    this.studentService
      .getTwoXXCredits(this.rollNumber)
      .subscribe((data: any) => {
        let courseBucketDetails = data;

        const newData = [];
        newData.push({
          rule: 'Atmost two 2xx level courses',
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
        });
        this.rules.push(newData);
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populateIPCredits() {
    this.studentService.getIPCredits(this.rollNumber).subscribe((data: any) => {
      let courseBucketDetails = data;

      const newData = [];
      newData.push({
        rule: 'Atmost 8 credits of IP/IS/UR',
        status: courseBucketDetails.status,
        credits: courseBucketDetails.credits,
      });
      this.rules.push(newData);
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  populateOnlineCourseCredits() {
    this.studentService
      .getOnlineCourseCredits(this.rollNumber)
      .subscribe((data: any) => {
        let courseBucketDetails = data;

        const newData = [];
        newData.push({
          rule: 'Atmost 8 credits of online courses',
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
        });
        this.rules.push(newData);
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populate32Credits() {
    this.studentService.get32Credits(this.rollNumber).subscribe((data: any) => {
      let courseBucketDetails = data;

      const newData = [];
      newData.push({
        rule: '32 Credits of CSE Courses',
        status: courseBucketDetails.status,
        credits: courseBucketDetails.credits,
      });
      this.rules.push(newData);
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }
}
