import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-online-courses-list',
  templateUrl: './online-courses-list.component.html',
  styleUrls: ['./online-courses-list.component.css']
})
export class OnlineCoursesListComponent {
  dataSource: MatTableDataSource<any>;
  rollNumber: number = 0;
  branch: string = '';
  courseData: any;
  displayedColumns: string[] = ['course', 'semester', 'status', 'credits', 'grade'];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.rollNumber = params['rollNumber'];
      this.branch = params['branch'];
      this.courseData = JSON.parse(params['courseData'])
      this.populateOnlineCourses();
    });
  }

  populateOnlineCourses() {
        const newData = [];
        for (let i = 0; i < this.courseData.length; i++) {
          newData.push({
            course: this.courseData[i].course,
            semester: this.courseData[i].semester,
            status: this.courseData[i].status,
            credits: this.courseData[i].credits,
            grade: this.courseData[i].grade,
          });
        }

        this.dataSource.data = [...this.dataSource.data, ...newData];
      }
      
      goBack() {
        this.router.navigate(['/dashboard', this.rollNumber]);
      }

}
