import express from "express";
import {
  DatabaseMap,
  getStudentDatabase,
  CourseMap,
  getCourseDatabase,
  StudentInfo,
} from "./database";

const courseListFilePath = "src/data/Course_Codes.xlsm";
const studentRecordsFilePath = "src/data/Student_Database_2019.xlsm";
const studentDatabase: DatabaseMap = getStudentDatabase(studentRecordsFilePath);
const courseDatabase: CourseMap = getCourseDatabase(courseListFilePath);

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

app.get("/api/student/:rollNumber", (req, res) => {
  // Get the rollNumber parameter from the request URL.
  const { rollNumber } = req.params;
  // Check if the roll number exists in the database.
  if (studentDatabase.hasOwnProperty(rollNumber)) {
    const studentData = {
      rollNumber: rollNumber,
      studentName: studentDatabase[Number(rollNumber)].studentName,
    };

    res.json(studentData);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/degree/:branch/:rollNumber", (req, res) => {
  // Get the branch parameter from the request URL.
  const { branch, rollNumber } = req.params;
  if (branch === "CSE") {
    // Path to the excel sheet containing courses and their course codes

    const coreCourses = courseDatabase["CSE Core Courses "];

    const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
    let disallowedGrades = ["I", "S", "W", "F", "X"];

    const studentCourses = studentInfo["courses"];
    let courses = 0;

    let studentCoreCourse = [];

    for (const courseCode of coreCourses) {
      let courseEntry = {
        course: courseCode,
        status: "NOT DONE",
        credits: 0,
      };

      for (const studentCourse of studentCourses) {
        if (studentCourse["courseCode"] === courseCode) {
          if (!disallowedGrades.includes(studentCourse["grade"])) {
            courseEntry.status = "DONE";
            courseEntry.credits = studentCourse["credit"];
          } else {
            courseEntry.status = "FAILED";
            courseEntry.credits = 0;
          }
          studentCoreCourse.push(courseEntry);
        }
      }
    }

    res.json(studentCoreCourse);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
