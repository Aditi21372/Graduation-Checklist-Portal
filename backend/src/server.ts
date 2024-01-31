import express from "express";
import * as fs from "fs";
import multer from "multer";

import { getGraduationStatus, getGraduationDate } from "./degree";
import {
  searchByRollNo,
  updateStudentGrade,
  preprocessCourseData,
  updateStudentDatabase,
} from "./database";
import { calculateCGPA } from "./cgpa";
import { StudentInfo } from "./type";

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
import { isMinors } from "./minors";

const app = express();
const port = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let studentCourseData: StudentInfo = {
  studentName: "",
  program: "",
  courses: [],
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

app.get("/api/login/:username/:password", (req, res) => {
  const { username, password } = req.params;
  if (username === "iiitdadmin" && password === "Admin@2019") {
    res.json(true);
  }

  res.status(404).json({ error: "User not found" });
});

app.get("/api/student/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;
  const studentData = await searchByRollNo(Number(rollNumber));
  if (studentData.length > 0) {
    res.json(studentData);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.post("/api/updateStudent", async (req, res) => {
  const studentData = req.body;
  const studentDataUpdated = await updateStudentGrade(studentData);
  if (studentDataUpdated) {
    res.json(studentDataUpdated);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/:rollNumber/info", async (req, res) => {
  // Get the rollNumber parameter from the request URL.
  const { rollNumber } = req.params;
  const studentData = await searchByRollNo(Number(rollNumber));
  // Check if the roll number exists in the database.
  if (studentData.length > 0) {
    const studentInfo = {
      rollNumber: rollNumber,
      studentName: studentData[0]["Student Name"],
      branch: studentData[0]["Program"],
    };

    res.json(studentInfo);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/:rollNumber/courseinfo", async (req, res) => {
  const { rollNumber } = req.params;
  const studentData = await searchByRollNo(Number(rollNumber));
  // Check if the roll number exists in the database.
  if (studentData.length > 0) {
    const studentInfo = {
      rollNumber: rollNumber,
      studentName: studentData[0]["Student Name"],
      branch: studentData[0]["Program"],
    };
    studentCourseData = preprocessCourseData(studentData);
    fs.writeFileSync(
      "./src/data/studentDatabase2.json",
      JSON.stringify(studentCourseData, null, 2)
    );
    res.json(studentInfo);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/:branch/mandatory", (req, res) => {
  // Get the branch parameter from the request URL.
  const { branch } = req.params;

  if (branch === "CSE") {
    res.json(mandatoryCoreRule.checkRule(studentCourseData, branch));
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/:branch/bucket", (req, res) => {
  // Get the branch parameter from the request URL.
  const { branch } = req.params;
  if (branch === "CSE") {
    res.json(mandatoryBucketRule.checkRule(studentCourseData, branch));
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/ssh", (req, res) => {
  res.json(sshRule.checkRule(studentCourseData, null));
});

app.get("/api/cw", (req, res) => {
  res.json(cwRule.checkRule(studentCourseData, null));
});

app.get("/api/sg", (req, res) => {
  res.json(sgRule.checkRule(studentCourseData, null));
});

app.get("/api/thirtytwocredits", (req, res) => {
  res.json(thirtyTwoCreditsRule.checkRule(studentCourseData, null));
});

app.get("/api/ip", (req, res) => {
  res.json(ipRule.checkRule(studentCourseData, null));
});

app.get("/api/onlinecourses", (req, res) => {
  res.json(onlineCoursesRule.checkRule(studentCourseData, null));
});

app.get("/api/twoxxcourses", (req, res) => {
  res.json(twoxxRule.checkRule(studentCourseData, null));
});

app.get("/api/btp", (req, res) => {
  res.json(btpRule.checkRule(studentCourseData, null));
});

app.get("/api/incompletegrade", (req, res) => {
  res.json(incompleteGradeRule.checkRule(studentCourseData, null));
});

app.get("/api/required-credits", (req, res) => {
  res.json(required156CreditsRule.checkRule(studentCourseData, "CSE"));
});

app.get("/api/honors", (req, res) => {
  res.json(isHonors(studentCourseData));
});

app.get("/api/minors", (req, res) => {
  res.json(isMinors(studentCourseData));
});

app.get("/api/graduation-check", (req, res) => {
  res.json(getGraduationStatus(studentCourseData, "CSE"));
});

app.get("/api/graduation-date", (req, res) => {
  res.json(getGraduationDate(studentCourseData));
});

app.get("/api/semester-wise-cgpa", (req, res) => {
  res.json(calculateCGPA(studentCourseData));
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const fileBuffer: Buffer | undefined = req.file?.buffer;

  if (fileBuffer) {
    const result = await updateStudentDatabase(fileBuffer);
    if (result) {
      res.status(200).json({ message: "File uploaded successfully" });
    } else {
      res.status(400).json({ error: "File Uploading failed" });
    }
  } else {
    res.status(400).json({ error: "Invalid file or no file provided" });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
