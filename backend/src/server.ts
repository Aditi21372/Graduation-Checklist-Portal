import express from "express";
import multer from "multer";
import xlsx from "xlsx";

import { getGraduationStatus, getGraduationDate } from "./degree";
import { calculateCGPA } from "./cgpa";
import { StudentInfo } from "./type";
import { isHonors } from "./honors";
import {
  isMinors,
  checkIpBtpForMinors,
  includeIp,
  approveApprenticeship,
} from "./minors";
import {
  getStudentData,
  updateStudentGrade,
  preprocessCourseData,
  updateStudentDatabase,
  updateCourseDatabase,
  updateStudentDetails,
  generateSummary,
  getSummary,
  sendPasswords,
  checkCredentials,
  searchByRollNo,
  getBtpData,
  includeBTP
} from "./database";
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
  csaiCoreRule,
  csaiApplicationRule,
  ecoMajorCore,
  ecoMajorElective,
  sshMajor,
} from "./rule";

const app = express();
const port = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let studentCourseData: StudentInfo = {
  studentName: "",
  program: "",
  rollNumber: 0,
  batch: 0,
  courses: [],
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:40000");
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
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.get("/api/student-login/:username/:password", async (req, res) => {
  const { username, password } = req.params;
  const rollNo = await checkCredentials(username, password);
  if (rollNo) {
    res.json(rollNo);
  } else {
    res.status(404).json({ error: "Wrong Credentials" });
  }
});

app.get("/api/student/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;
  const studentData = await getStudentData(Number(rollNumber));
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

app.get("/api/btp-sem-leave/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;
  const btpData = await getBtpData(Number(rollNumber));
  if (btpData.length > 0) {
    res.json(btpData);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.post("/api/include-btp", async (req, res) => {
  const data = req.body;
  res.json(await includeBTP(data[0], data[1]));
});

app.get("/api/:rollNumber/info", async (req, res) => {
  // Get the rollNumber parameter from the request URL.
  const { rollNumber } = req.params;
  const studentInfo = await searchByRollNo(Number(rollNumber));
  // Check if the roll number exists in the database.
  if (studentInfo) {
    res.json(studentInfo);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/:rollNumber/courseinfo", async (req, res) => {
  const { rollNumber } = req.params;
  const studentInfo = await searchByRollNo(Number(rollNumber));
  // Check if the roll number exists in the database.
  if (studentInfo) {
    studentCourseData = await preprocessCourseData(await getStudentData(Number(rollNumber)));
    res.json(studentInfo);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/:branch/mandatory", (req, res) => {
  // Get the branch parameter from the request URL.
  const { branch } = req.params;
  res.json(mandatoryCoreRule.checkRule(studentCourseData, branch));
});

app.get("/api/:branch/bucket", (req, res) => {
  // Get the branch parameter from the request URL.
  const { branch } = req.params;
  res.json(mandatoryBucketRule.checkRule(studentCourseData, branch));
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

app.get("/api/:branch/thirtytwocredits", (req, res) => {
  const { branch } = req.params;
  res.json(thirtyTwoCreditsRule.checkRule(studentCourseData, branch));
});

app.get("/api/csai-core", (req, res) => {
  res.json(csaiCoreRule.checkRule(studentCourseData, null));
});

app.get("/api/csai-application", (req, res) => {
  res.json(csaiApplicationRule.checkRule(studentCourseData, null));
});

app.get("/api/eco-major-core", (req, res) => {
  res.json(ecoMajorCore.checkRule(studentCourseData, null));
});

app.get("/api/eco-major-elective", (req, res) => {
  res.json(ecoMajorElective.checkRule(studentCourseData, null));
});

app.get("/api/ssh-major", (req, res) => {
  res.json(sshMajor.checkRule(studentCourseData, null));
});

app.get("/api/ip", (req, res) => {
  res.json(ipRule.checkRule(studentCourseData, null));
});

app.get("/api/onlinecourses", (req, res) => {
  res.json(onlineCoursesRule.checkRule(studentCourseData, null));
});

app.get("/api/:branch/twoxxcourses", (req, res) => {
  const { branch } = req.params;
  res.json(twoxxRule.checkRule(studentCourseData, branch));
});

app.get("/api/btp", (req, res) => {
  res.json(btpRule.checkRule(studentCourseData, null));
});

app.get("/api/incompletegrade", (req, res) => {
  res.json(incompleteGradeRule.checkRule(studentCourseData, null));
});

app.get("/api/required-credits", (req, res) => {
  res.json(required156CreditsRule.checkRule(studentCourseData, null));
});

app.get("/api/:branch/honors", (req, res) => {
  const { branch } = req.params;
  res.json(isHonors(studentCourseData, branch));
});

app.get("/api/minors", (req, res) => {
  res.json(isMinors(studentCourseData));
});

app.post("/api/update-minors", async (req, res) => {
  const Data = req.body;
  res.json(await includeIp(Data[0], Data[1], studentCourseData["rollNumber"]));
});

app.post("/api/update-student-minors", async (req, res) => {
  const { rollNumber, type } = req.body;
  const studentData = await getStudentData(Number(rollNumber));
  // Check if the roll number exists in the database.
  if (studentData.length <= 0) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  studentCourseData = await preprocessCourseData(studentData);

  if (type === "IP" || type === "BTP") {
    res.json(await checkIpBtpForMinors(studentCourseData, type));
  } else if (type === "Apprenticeship") {
    res.json(await approveApprenticeship(studentCourseData));
  }
});

app.get("/api/totalcredits", (req, res) => {
  res.json(required156CreditsRule.checkRule(studentCourseData, null));
});

app.get("/api/:branch/graduation-check", (req, res) => {
  const { branch } = req.params;
  res.json(getGraduationStatus(studentCourseData, branch));
});

app.get("/api/:branch/graduation-date", (req, res) => {
  const { branch } = req.params;
  res.json(getGraduationDate(studentCourseData, branch));
});

app.get("/api/request-provisional/:rollNumber", (req, res) => {
  const { rollNumber } = req.params;
  res.json({ message: "Request Sent" });
});

app.get("/api/semester-wise-cgpa", (req, res) => {
  res.json(calculateCGPA(studentCourseData));
});

app.post(
  "/api/upload-student-database",
  upload.single("file"),
  async (req, res) => {
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
  }
);

app.post(
  "/api/upload-course-database",
  upload.single("file"),
  async (req, res) => {
    const fileBuffer: Buffer | undefined = req.file?.buffer;
    const originalFileName: string | undefined = req.file?.originalname;

    if (fileBuffer && originalFileName) {
      const result = updateCourseDatabase(fileBuffer, originalFileName);
      if (result) {
        res.status(200).json({ message: "File uploaded successfully" });
      } else {
        res.status(400).json({ error: "File Uploading failed" });
      }
    } else {
      res.status(400).json({ error: "Invalid file or no file provided" });
    }
  }
);

app.post(
  "/api/upload-students-details",
  upload.single("file"),
  async (req, res) => {
    const fileBuffer: Buffer | undefined = req.file?.buffer;

    if (fileBuffer) {
      const result = await updateStudentDetails(fileBuffer);
      if (result == 1) {
        res.status(200).json({ message: "File uploaded successfully" });
      } else if (result == 0) {
        res.status(400).json({ error: "No new entry to add" });
      } else {
        res.status(400).json({ error: "File Uploading failed" });
      }
    } else {
      res.status(400).json({ error: "Invalid file or no file provided" });
    }
  }
);

app.get("/api/get-students-details", async (req, res) => {
  const excelBuffer = await sendPasswords();
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=studentsInfo.xlsx"
  );
  res.send(excelBuffer);
});

app.get("/api/:batch/summary", async (req, res) => {
  const { batch } = req.params;
  const studentData = await getSummary(Number(batch));
  if (studentData.length > 0) {
    res.json(studentData);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Summary does not Exist" });
  }
});

app.get("/api/:batch/download-summary", async (req, res) => {
  const { batch } = req.params;
  const studentData = await getSummary(Number(batch));
  const workbook = xlsx.utils.book_new();
  const sheet = xlsx.utils.json_to_sheet(studentData);
  xlsx.utils.book_append_sheet(workbook, sheet, "StudentSummary");
  const excelBuffer = xlsx.write(workbook, { type: "buffer" });
  if (studentData.length > 0) {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=studentsInfo.xlsx"
    );
    res.send(excelBuffer);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Summary does not Exist" });
  }
});

app.get("/api/generate-summary", async (req, res) => {
  res.json(generateSummary());
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
