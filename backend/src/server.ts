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

let disallowedGrades = ["I", "S", "W", "F", "X"];
const gradeHierarchy = ["A+", "A", "A-", "B", "B-", "C", "C-", "D", ""];

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
      branch: studentDatabase[Number(rollNumber)].program,
    };

    res.json(studentData);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/degree/:branch/:rollNumber/mandatory", (req, res) => {
  // Get the branch parameter from the request URL.
  const { branch, rollNumber } = req.params;
  if (branch === "CSE") {
    // Path to the excel sheet containing courses and their course codes

    const coreCourses = courseDatabase["CSE Core Courses "];
    const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
    const studentCourses = studentInfo["courses"];

    let studentCoreCourse = [];

    for (const courseCode of coreCourses) {
      let courseEntry = {
        course: courseCode,
        status: "Not Done",
        credits: 0,
        grade: "",
      };

      for (const studentCourse of studentCourses) {
        if (studentCourse["courseCode"] === courseCode) {
          if (!disallowedGrades.includes(studentCourse["grade"])) {
            courseEntry.status = "Done";
            courseEntry.credits = studentCourse["credit"];
            const currentGradeIndex = gradeHierarchy.indexOf(courseEntry.grade);
            const gradeIndex = gradeHierarchy.indexOf(studentCourse["grade"]);
            if (gradeIndex < currentGradeIndex) {
              courseEntry.grade = studentCourse["grade"];
            }
          } else {
            if (courseEntry.status == "Done") continue;
            courseEntry.status = "FAILED";
            courseEntry.credits = 0;
            courseEntry.grade = "F";
          }
        }
      }
      studentCoreCourse.push(courseEntry);
    }

    res.json(studentCoreCourse);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/degree/:branch/:rollNumber/bucket", (req, res) => {
  // Get the branch parameter from the request URL.
  const { branch, rollNumber } = req.params;
  if (branch === "CSE") {
    // Path to the excel sheet containing courses and their course codes
    const mandatoryBuckets = [];
    const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
    const studentCourses = studentInfo["courses"];
    let studentBucketCourse = [];

    for (const key of Object.keys(courseDatabase)) {
      if (key.startsWith("Mandatory")) {
        mandatoryBuckets.push(courseDatabase[key]);
      }
    }

    for (const courseBucket of mandatoryBuckets) {
      let mandateBucket = [];
      for (const courseCode of courseBucket) {
        let courseEntry = {
          course: courseCode,
          status: "Not Done",
          credits: 0,
          grade: "",
        };

        for (const studentCourse of studentCourses) {
          if (studentCourse["courseCode"] === courseCode) {
            if (!disallowedGrades.includes(studentCourse["grade"])) {
              courseEntry.status = "Done";
              courseEntry.credits = studentCourse["credit"];
              const currentGradeIndex = gradeHierarchy.indexOf(
                courseEntry.grade
              );
              const gradeIndex = gradeHierarchy.indexOf(studentCourse["grade"]);
              if (gradeIndex < currentGradeIndex) {
                courseEntry.grade = studentCourse["grade"];
              }
            } else {
              if (courseEntry.status == "Done") continue;
              courseEntry.status = "FAILED";
              courseEntry.credits = 0;
              courseEntry.grade = "F";
            }
          }
        }
        mandateBucket.push(courseEntry);
      }
      studentBucketCourse.push(mandateBucket);
    }
    res.json(studentBucketCourse);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/degree/:rollNumber/ssh", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;
  const sshCourses = courseDatabase["SSH Courses"];
  const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
  const studentCourses = studentInfo["courses"];
  let coursesTaken = new Map<string, number>();
  let credits = 0;

  let courseEntry = {
    status: "Not Done",
    credits: 0,
  };

  for (const course of studentCourses) {
    for (const courseCode of sshCourses) {
      if (
        course["courseCode"] === courseCode &&
        !disallowedGrades.includes(course["grade"]) &&
        !coursesTaken.has(course["courseCode"])
      ) {
        coursesTaken.set(course["courseCode"], 1);
        credits += course["credit"];
      }
    }
  }
  if (credits >= 12) {
    courseEntry.status = "Done";
  }
  courseEntry.credits = credits;
  res.json(courseEntry);
});

app.get("/api/degree/:rollNumber/cw", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;
  const cwCourses = courseDatabase["CW Course"];
  const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
  const studentCourses = studentInfo["courses"];
  let credits = 0;

  let courseEntry = {
    status: "Not Done",
    credits: 0,
  };

  for (const courseCode of cwCourses) {
    for (const course of studentCourses) {
      if (course["courseCode"] === courseCode && course["grade"] == "S") {
        credits += course["credit"];
      }
    }
  }
  if (credits >= 2) {
    courseEntry.status = "Done";
  }
  courseEntry.credits = credits;
  res.json(courseEntry);
});

app.get("/api/degree/:rollNumber/sg", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;
  const sgCourses = courseDatabase["SG Course"];
  const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
  const studentCourses = studentInfo["courses"];
  let coursesTaken = new Map<string, number>();
  let credits = 0;

  let courseEntry = {
    status: "Not Done",
    credits: 0,
  };

  for (const courseCode of sgCourses) {
    for (const course of studentCourses) {
      if (course["courseCode"] === courseCode && course["grade"] == "S") {
        credits += course["credit"];
      }
    }
  }
  if (credits >= 2) {
    courseEntry.status = "Done";
  }
  courseEntry.credits = credits;
  res.json(courseEntry);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
