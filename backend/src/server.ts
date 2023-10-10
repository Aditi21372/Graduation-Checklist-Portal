import express from "express";
import { StudentInfo } from "./database";

import {
  gradeHierarchy,
  disallowedGrades,
  studentDatabase,
  courseDatabase,
} from "./index";

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

app.get("/api/degree/:rollNumber/btp", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;
  const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
  const studentCourses = studentInfo["courses"];
  let sem = [];
  let credits = 0;

  let courseEntry = {
    status: "Not Done",
    credits: 0,
  };

  for (const course of studentCourses) {
    const courseCodebtp = course["courseCode"].substring(0, 3);
    if (
      courseCodebtp === "BTP" &&
      !disallowedGrades.includes(course["grade"])
    ) {
      credits += course["credit"];
      sem.push(course["semester"]);
    }
  }

  if (credits >= 8 && credits <= 12) {
    const pairDifferences = [];
    for (let i = 0; i < sem.length; i++) {
      for (let j = i + 1; j < sem.length; j++) {
        const num1 = parseFloat(sem[i]); // Convert the string to a number
        const num2 = parseFloat(sem[j]); // Convert the string to a number

        if (!isNaN(num1) && !isNaN(num2)) {
          const difference = Math.abs(num1 - num2); // Calculate the absolute difference
          pairDifferences.push(difference);
        }
      }
    }
    for (const pairDiff of pairDifferences) {
      if (pairDiff == 1) {
        courseEntry.status = "Done";
      }
    }
  } else if (credits == 0) {
    courseEntry.status = "Done";
  } else {
    courseEntry.status = "Doesn't fulfill BTP requirements";
  }
  courseEntry.credits = credits;
  res.json(courseEntry);
});

app.get("/api/degree/:rollNumber/twoxxcourses", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;
  const coreCourses = courseDatabase["CSE Core Courses "];
  const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
  const studentCourses = studentInfo["courses"];
  let courses = 0;
  let credits = 0;

  let courseEntry = {
    status: "Not Done",
    credits: 0,
  };

  const mandatoryBuckets = [];
  for (const key of Object.keys(courseDatabase)) {
    if (key.startsWith("Mandatory")) {
      mandatoryBuckets.push(courseDatabase[key]);
    }
  }

  const mandatoryBucketCourses = [];
  for (const courseBucket of mandatoryBuckets) {
    for (const course of courseBucket) {
      mandatoryBucketCourses.push(course);
    }
  }

  for (const course of studentCourses) {
    if (
      course["courseCode"].substring(3, 4) === "2" &&
      !disallowedGrades.includes(course["grade"]) &&
      (course["semester"] >= "5" || course["semester"] >= "Summer Term 3") &&
      !courseDatabase["SSH Courses"].includes(course["courseCode"]) &&
      !coreCourses.includes(course["courseCode"]) &&
      !mandatoryBucketCourses.includes(course["courseCode"])
    ) {
      courses += 1;
    }
  }

  if (courses <= 2) {
    courseEntry.status = "Done";
  }
  courseEntry.credits = credits;
  res.json(courseEntry);
});

app.get("/api/degree/:rollNumber/ip", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;
  const ipCourses = courseDatabase["IP/IS/UR"];
  const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
  const studentCourses = studentInfo["courses"];
  let credits = 0;

  let courseEntry = {
    status: "Not Done",
    credits: 0,
  };

  for (const course of studentCourses) {
    const courseCodeIp = course["courseCode"].substring(0, 3);
    for (const courseCode of ipCourses) {
      if (
        courseCodeIp === courseCode &&
        !disallowedGrades.includes(course["grade"])
      ) {
        credits += course["credit"];
      }
    }
  }

  if (credits <= 8) {
    courseEntry.status = "Done";
  } else {
    courseEntry.status = "Doesn't fulfill IP/IS/UR requirements";
  }
  courseEntry.credits = credits;
  res.json(courseEntry);
});

app.get("/api/degree/:rollNumber/onlinecourses", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;
  const onlineCourses = courseDatabase["Online course"];
  const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
  const studentCourses = studentInfo["courses"];
  let credits = 0;

  let courseEntry = {
    status: "Not Done",
    credits: 0,
  };

  for (const course of studentCourses) {
    for (const courseCode of onlineCourses) {
      if (course["courseCode"] === courseCode && course["grade"] == "S") {
        credits += course["credit"];
      }
    }
  }

  if (credits <= 8) {
    courseEntry.status = "Done";
  } else {
    courseEntry.status = "Doesn't fulfill Online Course requirements";
  }
  courseEntry.credits = credits;
  res.json(courseEntry);
});

app.get("/api/degree/:rollNumber/thirtytwocredits", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;
  const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
  const studentCourses = studentInfo["courses"];
  let credits = 0;
  let coursesTaken = new Map<string, number>();

  let courseEntry = {
    status: "Not Done",
    credits: 0,
  };

  for (const course of studentCourses) {
    // Doesn't check for a 2xx course.
    // Doesn't check for courses that were not done in the last four semesters.
    if (course["courseCode"].startsWith("CSE2") || course["semester"] < "5") {
      continue;
    }
    // Checks if the course has a valid grade against it and is a CSE course.
    if (
      !disallowedGrades.includes(course["grade"]) &&
      !coursesTaken.has(course["courseCode"]) &&
      course["courseCode"].startsWith("CSE")
    ) {
      credits += course["credit"];
      coursesTaken.set(course["courseCode"], course["credit"]);
    }
  }

  if (credits >= 32) {
    courseEntry.status = "Done";
  }
  courseEntry.credits = credits;
  res.json(courseEntry);
});

app.get("/api/degree/:rollNumber/semester-wise-cgpa", (req, res) => {
  // Get the rollNumber parameter from the request URL.
  const { rollNumber } = req.params;

  // Check if the roll number exists in the database.
  if (studentDatabase.hasOwnProperty(rollNumber)) {
    // Replace this with your logic to fetch semester-wise CGPA data.
    // You can calculate it from the student's course grades and credits.
    // For demonstration purposes, let's assume you have a function to calculate CGPA.
    // const semesterWiseCGPA = calculateSemesterWiseCGPA(rollNumber);

    // Return the semester-wise CGPA data.
    res.json([
      { semester: "Semester 1", cgpa: 3.75 },
      { semester: "Semester 2", cgpa: 3.82 },
      { semester: "Semester 3", cgpa: 3.96 },
      { semester: "Semester 4", cgpa: 3.89 },
      { semester: "Semester 5", cgpa: 3.91 },
      { semester: "Semester 6", cgpa: 4.0 },
      { semester: "Semester 7", cgpa: 3.98 },
      { semester: "Semester 8", cgpa: 4.0 },
    ]);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
