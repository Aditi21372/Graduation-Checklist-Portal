import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { StudentServiceService } from "../student-service.service";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-checklist",
  templateUrl: "./checklist.component.html",
  styleUrls: ["./checklist.component.css"],
})
export class ChecklistComponent implements OnInit {
  @Input() rollNumber: number = 0;
  @Output() graduationStatusChanged: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();
  branch: string = "";
  displayedColumns: string[] = ["course", "status", "credits", "grade"];
  displayedColumn: string[] = ["rule", "status", "credits", "actions"];
  isTable1Expanded = true;
  isTable2Expanded = [true, true, true, true, true];
  completedMandatory = true;
  completedBuckets = [true, true, true, true, true];
  completedCoreCourses = true;
  isCoreCoursesExpanded = true;

  dataSource: MatTableDataSource<any>;
  dataSourceTwo: MatTableDataSource<any>;
  isChecklistVisible = false;
  tablesData: MatTableDataSource<any>[] = [];
  rules: any[] = [];
  hasGraduated: boolean[] = [];
  graduationStatus: boolean = false;

  constructor(
    private studentService: StudentServiceService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource();
    this.dataSourceTwo = new MatTableDataSource();
  }

  async ngOnInit() {
    // Call the service to fetch student data
    const studentData = await this.studentService
      .getStudentData(this.rollNumber.toString())
      .toPromise();
    this.branch = studentData.branch;

    // Create an array of asynchronous method calls as Promises
    const promises = [
      this.populateMandatory(),
      this.populateBuckets(),
      this.populateSSH(),
      this.populateCW(),
      this.populateSG(),
      this.populate32Credits(),
      this.populateIPCredits(),
      this.populateOnlineCourseCredits(),
      this.populateTwoXXCredits(),
      this.populateBTP(),
      this.required156Credits(),
    ];

    // Use Promise.all to wait for all Promises to complete
    await Promise.all(promises);

    // Now, all asynchronous calls have completed
    // Call the setGraduationStatus method
    console.log(this.hasGraduated.length);
    this.setGraduationStatus(this.hasGraduated);
  }

  populateMandatory() {
    this.branch = this.branch.slice(
      this.branch.lastIndexOf("/") + 1,
      this.branch.length
    );

    this.studentService
      .getMandatoryCourses(this.branch, this.rollNumber)
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource();
        let courseDetails = data;
        let credits = 0;
        const newData = [];

        for (let i = 0; i < courseDetails.length; i++) {
          newData.push({
            course: courseDetails[i].course,
            status: courseDetails[i].status,
            credits: courseDetails[i].credits,
            grade: courseDetails[i].grade,
          });

          if (courseDetails[i].status !== "Complete") {
            this.completedMandatory = false;
          } else {
            credits += courseDetails[i].credits;
          }
        }

        let status = "Incomplete";

        if (this.completedMandatory) {
          status = "Complete";
          this.hasGraduated.push(true);
        } else {
          this.hasGraduated.push(false);
        }

        const tempData = [];
        tempData.push({
          rule: "Core Courses",
          status: status,
          credits: credits,
          button_text: "View Core Courses",
        });
        this.rules.push(tempData);
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...tempData];

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

            if (courseBucketDetails[i][j].status === "Complete") {
              atleastOne = true;
            }
          }
          if (!atleastOne) {
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
          rule: "12 credits of SSH courses",
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
          button_text: "View SSH Courses",
        });

        if (courseBucketDetails.status !== "Complete") {
          this.hasGraduated.push(false);
        } else {
          this.hasGraduated.push(true);
        }
        this.rules.push(newData);
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populateCW() {
    this.studentService.getCWcourses(this.rollNumber).subscribe((data: any) => {
      let courseBucketDetails = data;

      const newData = [];
      newData.push({
        rule: "2 credits of Community Work",
        status: courseBucketDetails.status,
        credits: courseBucketDetails.credits,
        button_text: "View Details",
      });
      this.rules.push(newData);
      if (courseBucketDetails.status !== "Complete") {
        this.hasGraduated.push(false);
      } else {
        this.hasGraduated.push(true);
      }
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  populateSG() {
    this.studentService.getSGcourses(this.rollNumber).subscribe((data: any) => {
      let courseBucketDetails = data;

      const newData = [];
      newData.push({
        rule: "2 credits of Self Growth",
        status: courseBucketDetails.status,
        credits: courseBucketDetails.credits,
        button_text: "View Details",
      });
      this.rules.push(newData);
      if (courseBucketDetails.status !== "Complete") {
        this.hasGraduated.push(false);
      } else {
        this.hasGraduated.push(true);
      }
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
          rule: "BTP",
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
          button_text: "View Details",
        });
        this.rules.push(newData);
        if (courseBucketDetails.status !== "Complete") {
          this.hasGraduated.push(false);
        } else {
          this.hasGraduated.push(true);
        }
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
          rule: "Atmost two 2xx level courses",
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
          button_text: "View Courses",
        });
        this.rules.push(newData);
        if (courseBucketDetails.status !== "Complete") {
          this.hasGraduated.push(false);
        } else {
          this.hasGraduated.push(true);
        }
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populateIPCredits() {
    this.studentService.getIPCredits(this.rollNumber).subscribe((data: any) => {
      let courseBucketDetails = data;

      const newData = [];
      newData.push({
        rule: "Atmost 8 credits of IP/IS/UR",
        status: courseBucketDetails.status,
        credits: courseBucketDetails.credits,
        button_text: "View Details",
      });
      this.rules.push(newData);
      if (courseBucketDetails.status !== "Complete") {
        this.hasGraduated.push(false);
      } else {
        this.hasGraduated.push(true);
      }
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
          rule: "Atmost 8 credits of online courses",
          status: courseBucketDetails.status,
          credits: courseBucketDetails.credits,
          button_text: "View Online Courses",
        });
        this.rules.push(newData);
        if (courseBucketDetails.status !== "Complete") {
          this.hasGraduated.push(false);
        } else {
          this.hasGraduated.push(true);
        }
        this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
      });
  }

  populate32Credits() {
    this.studentService.get32Credits(this.rollNumber).subscribe((data: any) => {
      let courseBucketDetails = data;

      const newData = [];
      newData.push({
        rule: "32 Credits of CSE Courses",
        status: courseBucketDetails.status,
        credits: courseBucketDetails.credits,
        button_text: "View CSE Courses",
      });
      this.rules.push(newData);
      if (courseBucketDetails.status !== "Complete") {
        this.hasGraduated.push(false);
      } else {
        this.hasGraduated.push(true);
      }
      this.dataSourceTwo.data = [...this.dataSourceTwo.data, ...newData];
    });
  }

  required156Credits() {
    this.studentService
      .getRequiredCredits(this.rollNumber)
      .subscribe((data: any) => {
        let completedCredits = data;

        if (completedCredits.status !== "Complete") {
          this.hasGraduated.push(false);
        } else {
          this.hasGraduated.push(true);
        }
      });
  }

  setGraduationStatus(hasGraduated: boolean[]): void {
    this.graduationStatus = true; // Assume true initially
    console.log(hasGraduated);
    for (let i = 0; i < 10; i++) {
      console.log("Inside loop");
      if (!this.hasGraduated[i]) {
        this.graduationStatus = false;
        console.log("Hello");
        break; // Break out of the loop if any element is false
      }
    }
    this.graduationStatusChanged.emit(this.graduationStatus);
  }

  // Add this function to navigate to different pages based on the row data
  navigateToPage(element: any): void {
    // Example: Navigate to a page based on the 'rule' property
    switch (element.rule) {
      case "Core Courses":
        this.router.navigate(["/core-courses-list", this.rollNumber]);
        break;
      case "12 credits of SSH courses":
        this.router.navigate(["/ssh-courses-list", this.rollNumber]);
        break;
      case "2 credits of Community Work":
        this.router.navigate(["/cw-details", this.rollNumber]);
        break;
      case "2 credits of Self Growth":
        this.router.navigate(["/sg-details", this.rollNumber]);
        break;
      case "BTP":
        this.router.navigate(["/btp-details", this.rollNumber]);
        break;
      case "Atmost two 2xx level courses":
        this.router.navigate(["/twoxx-courses-list", this.rollNumber]);
        break;
      case "Atmost 8 credits of IP/IS/UR":
        this.router.navigate(["/ip-details", this.rollNumber]);
        break;
      case "32 Credits of CSE Courses":
        this.router.navigate(["/branch-courses-list", this.rollNumber]);
        break;
      case "Atmost 8 credits of online courses":
        this.router.navigate(["/online-courses-list", this.rollNumber]);
        break;
    }
  }
}
