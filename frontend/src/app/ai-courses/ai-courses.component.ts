import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { UtilityService } from '../utility.service';
@Component({
  selector: 'app-ai-courses',
  templateUrl: './ai-courses.component.html',
  styleUrls: ['./ai-courses.component.css'],
})
export class AiCoursesComponent {
  rollNumber: number = 0;
  studentName: string = '';
  program: string = '';
  displayedColumns: string[] = [
    'course',
    'courseName',
    'semester',
    'status',
    'credits',
    'grade',
  ];
  aiCourses: any;
  courseCategories: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.rollNumber = params['rollNumber'];
      this.studentName = params['studentName'];
      this.program = params['program'];
      this.aiCourses = JSON.parse(params['aiCourses']);
      this.populateCoreCourses();
    });
  }

  populateCoreCourses() {
    const titles = [
      'CSE CORE (8)',
      'CSAI CORE (8)',
      'CSAI APPLICATION(16)',
      'MATHS CORE(4)',
    ];
    let count = -1;
    for (const ai of this.aiCourses) {
      count += 1;
      const newData = [];
      for (const course of ai.data.courses) {
        newData.push({
          course: course.course,
          courseName: course.courseName,
          semester: course.semester,
          status: course.status,
          credits: course.credits,
          grade: course.grade,
        });
      }
      let category = new MatTableDataSource();
      category.data = [...category.data, ...newData];
      category.data = category.data.sort((a: any, b: any) =>
        this.utilityService.customSort(a.semester, b.semester)
      );

      this.courseCategories.push({
        title: titles[count],
        status: ai.isCompleteBool,
        courses: category,
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard', this.rollNumber]);
  }
}
