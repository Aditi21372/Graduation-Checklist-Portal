import express from "express";

import { studentDatabase, findCGPA } from "./index";
import { getGraduationStatus } from "./degree";

import {
  sshRule,
  cwRule,
  sgRule,
  btpRule,
  mandatoryCoreRule,
  mandatoryBucketRule,
  twoxxRule,
  required156CreditsRule,
  ipRule,
  onlineCoursesRule,
  thirtyTwoCreditsRule,
  incompleteGradeRule,
} from "./rule";
import { isHonors } from "./honors";

const app = express();
const port = 3000;

export const sum = (a: number, b: number) => a + b;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

app.get("/api/:rollNumber/info", (req, res) => {
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

app.get("/api/:branch/:rollNumber/mandatory", (req, res) => {
  // Get the branch parameter from the request URL.
  const { branch, rollNumber } = req.params;

  if (branch === "CSE") {
    res.json(mandatoryCoreRule.checkRule(Number(rollNumber), branch));
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/:branch/:rollNumber/bucket", (req, res) => {
  // Get the branch parameter from the request URL.
  const { branch, rollNumber } = req.params;
  if (branch === "CSE") {
    res.json(mandatoryBucketRule.checkRule(Number(rollNumber), branch));
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/:rollNumber/ssh", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;

  res.json(sshRule.checkRule(Number(rollNumber), null));
});

app.get("/api/:rollNumber/cw", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;

  res.json(cwRule.checkRule(Number(rollNumber), null));
});

app.get("/api/:rollNumber/sg", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;

  res.json(sgRule.checkRule(Number(rollNumber), null));
});

app.get("/api/:rollNumber/btp", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;

  res.json(btpRule.checkRule(Number(rollNumber), null));
});

app.get("/api/:rollNumber/twoxxcourses", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;

  res.json(twoxxRule.checkRule(Number(rollNumber), null));
});

app.get("/api/:rollNumber/ip", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;

  res.json(ipRule.checkRule(Number(rollNumber), null));
});

app.get("/api/:rollNumber/onlinecourses", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;

  res.json(onlineCoursesRule.checkRule(Number(rollNumber), null));
});

app.get("/api/:rollNumber/thirtytwocredits", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;

  res.json(thirtyTwoCreditsRule.checkRule(Number(rollNumber), null));
});

app.get("/api/:rollNumber/incompletegrade", (req, res) => {
  // Get the branch parameter from the request URL.
  const { rollNumber } = req.params;

  res.json(incompleteGradeRule.checkRule(Number(rollNumber), null));
});

app.get("/api/:rollNumber/required-credits", (req, res) => {
  const { rollNumber } = req.params;

  res.json(required156CreditsRule.checkRule(Number(rollNumber), null));
});

app.get("/api/:rollNumber/graduation-check", (req, res) => {
  const { rollNumber } = req.params;

  res.json(getGraduationStatus(Number(rollNumber), "CSE"));
});

app.get("/api/:rollNumber/semester-wise-cgpa", (req, res) => {
  // Get the rollNumber parameter from the request URL.
  const { rollNumber } = req.params;

  // Check if the roll number exists in the database.
  if (studentDatabase.hasOwnProperty(rollNumber)) {
    // Replace this with your logic to fetch semester-wise CGPA data.
    // You can calculate it from the student's course grades and credits.
    // For demonstration purposes, let's assume you have a function to calculate CGPA.
    const semesterWiseCGPA = findCGPA(Number(rollNumber));

    // Return the semester-wise CGPA data.
    res.json(semesterWiseCGPA);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/:rollNumber/honors", (req, res) => {
  // Get the rollNumber parameter from the request URL.
  const { rollNumber } = req.params;

  console.log("Is Honors Backend: ", isHonors(Number(rollNumber)));
  res.json(isHonors(Number(rollNumber)));
});

app.get("/api/login/:username/:password", (req, res) => {
  const { username, password } = req.params;
  if (username === "admin" && password === "admin") {
    res.json(true);
  }

  res.status(404).json({ error: "User not found" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
