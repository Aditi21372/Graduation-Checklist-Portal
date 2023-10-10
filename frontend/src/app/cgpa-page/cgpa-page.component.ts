import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentServiceService } from '../student-service.service'; // Import your service here
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cgpa-page',
  templateUrl: './cgpa-page.component.html',
  styleUrls: ['./cgpa-page.component.css'],
})
export class CgpaPageComponent implements OnInit {
  displayedColumns: string[] = ['semester', 'cgpa'];
  dataSource: MatTableDataSource<any>;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentServiceService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    // Get the 'rollNumber' parameter from the route
    this.route.params.subscribe((params) => {
      // Check if 'rollNumber' is a valid number
      const rollNumber = +params['rollNumber'];

      if (!isNaN(rollNumber)) {
        // Fetch CGPA data using the retrieved 'rollNumber'
        this.studentService
          .getSemWiseCGPA(rollNumber)
          .subscribe((data: any) => {
            // Assuming 'data' contains an array of objects with 'semester' and 'cgpa' properties

            // Map the data to match the table structure
            const cgpaData = data.map((item: any) => ({
              semester: item.semester,
              cgpa: item.cgpa,
            }));

            // Set the data source for the table
            this.dataSource.data = cgpaData;
          });
      } else {
        // Handle the case where 'rollNumber' is not a valid number
        console.error('Invalid rollNumber:', params['rollNumber']);
      }
    });
  }
}
