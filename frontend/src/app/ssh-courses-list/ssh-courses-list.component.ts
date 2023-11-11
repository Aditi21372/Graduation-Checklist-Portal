import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ssh-courses-list',
  templateUrl: './ssh-courses-list.component.html',
  styleUrls: ['./ssh-courses-list.component.css']
})
export class SshCoursesListComponent {
  dataSource: MatTableDataSource<any>;
  rollNumber: number = 0;
  branch: string = '';
  courseData: any;
  displayedColumns: string[] = ['course', 'status', 'credits', 'grade'];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.rollNumber = params['rollNumber'];
      this.branch = params['branch'];
      this.courseData = JSON.parse(params['courseData'])
      this.populateSSHCourses();
      console.log(this.dataSource.data[0])
    });
  }

  populateSSHCourses() {
        const newData = [];
        console.log(this.courseData[0])
        for (let i = 0; i < this.courseData.length; i++) {
          newData.push({
            course: this.courseData[i].course,
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

