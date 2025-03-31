// This file contains the server code for the backend of the Graduation Checklist application.Is is used to handle the API requests from the frontend and interact with the database.

import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import jwt from 'jsonwebtoken';
import { securityHeaders, corsConfig, rateLimiter, csrfProtection, authenticateJWT } from "./middleware/securityMiddleware";
import { courseDatabase } from "./database";
import { disallowedGrades, allRules } from "./rule";

import { getGraduationStatus, getGraduationDate } from "./degree";
import { calculateCGPA } from "./cgpa";
import { StudentInfo, CourseData } from "./type";
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
  includeBTP,
  addToProvisional,
  getAllProvisional,
  generateProvisionalDegree,
  twiceFailCourses,
  substituteCourses,
  updateTwiceFail,
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
  csaiCseCoreRule,
  csaiCoreRule,
  csaiApplicationRule,
  csaiMathsCoreRule,
  ecoMajorCore,
  ecoMajorElective,
  sshMajor,
} from "./rule";

const app = express();
const port = 3002;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let studentCourseData: StudentInfo = {
  studentName: "",
  program: "",
  rollNumber: 0,
  batch: 0,
  courses: [],
};

// Apply security middleware
app.use(securityHeaders);
app.use(corsConfig);
app.use(rateLimiter);
app.use(csrfProtection);
app.use(express.json());


app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ userId: username, role: 'admin' }, process.env.JWT_SECRET as string, { expiresIn: '6h' });
    res.json({ token });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/api/student-login", async (req, res) => {
  const { username, password } = req.body;
  const rollNo = await checkCredentials(username, password);
  if (rollNo) {
    const token = jwt.sign({ userId: rollNo, role: 'student' }, process.env.JWT_SECRET as string, { expiresIn: '10m' });
    res.json({ token });
  } else {
    res.status(404).json({ error: "Wrong Credentials" });
  }
});

app.get("/api/:rollNumber/info", authenticateJWT, async (req, res) => {
  const { rollNumber } = req.params;
  const studentInfo = await searchByRollNo(Number(rollNumber));
  if (studentInfo) {
    res.json(studentInfo);
  } else {
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/:rollNumber/checklist", authenticateJWT, async (req, res) => {
  const { rollNumber } = req.params;
  const studentInfo = await searchByRollNo(Number(rollNumber));
  
  if (!studentInfo) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  try {
    const studentData = await preprocessCourseData(
      await getStudentData(Number(rollNumber))
    );
    
    const checklistResults = allRules.map(rule => ({
      ruleId: rule.ruleId,
      result: rule.checkRule(studentData, studentInfo.program)
    }));
    
    res.json({
      studentInfo,
      checklistResults
    });
  } catch (error) {
    console.error("Error processing checklist:", error);
    res.status(500).json({ error: "Error processing checklist" });
  }
});

app.get("/api/:rollNumber/courseinfo", authenticateJWT, async (req, res) => {
  const { rollNumber } = req.params;
  const studentInfo = await searchByRollNo(Number(rollNumber));
  if (studentInfo) {
    studentCourseData = await preprocessCourseData(
      await getStudentData(Number(rollNumber))
    );
    res.json(studentInfo);
  } else {
    res.status(404).json({ error: "Student not found" });
  }
});


app.get("/api/:branch/mandatory", authenticateJWT, (req, res) => {
  // Get the branch parameter from the request URL.
  const { branch } = req.params;
  res.json(mandatoryCoreRule.checkRule(studentCourseData, branch));
});

app.get("/api/:branch/bucket", authenticateJWT, (req, res) => {
  // Get the branch parameter from the request URL.
  const { branch } = req.params;
  res.json(mandatoryBucketRule.checkRule(studentCourseData, branch));
});

app.get("/api/:branch/ssh", authenticateJWT, (req, res) => {
  // Get the branch parameter from the request URL.
  const { branch } = req.params;
  res.json(sshRule.checkRule(studentCourseData, branch));
});

app.get("/api/cw", authenticateJWT, (req, res) => {
  res.json(cwRule.checkRule(studentCourseData, null));
});

app.get("/api/sg", authenticateJWT, (req, res) => {
  res.json(sgRule.checkRule(studentCourseData, null));
});

app.get("/api/:branch/thirtytwocredits", authenticateJWT, (req, res) => {
  const { branch } = req.params;
  res.json(thirtyTwoCreditsRule.checkRule(studentCourseData, branch));
});

app.get("/api/csai", authenticateJWT, (req, res) => {
  const csaiCseCore = csaiCseCoreRule.checkRule(studentCourseData, null);
  const csaiCore = csaiCoreRule.checkRule(studentCourseData, null);
  const csaiApplication = csaiApplicationRule.checkRule(studentCourseData, null);
  const csaiMathCore  = csaiMathsCoreRule.checkRule(studentCourseData, null);
  const courses = [csaiCseCore, csaiCore, csaiApplication, csaiMathCore];
  const status = courses.every(x => x.isCompleteBool);
  const credits = courses.reduce((sum, course) => sum + course.data.totalCredits, 0);

  const responseJson = {
    courses: courses,
    isCompleteBool: status,
    isCompleteText: status ? 'Complete' : 'Incomplete',
    totalCredits: credits
  }

  res.json(responseJson);
});

app.get("/api/eco-major-core", authenticateJWT, (req, res) => {
  res.json(ecoMajorCore.checkRule(studentCourseData, null));
});

app.get("/api/eco-major-elective", authenticateJWT, (req, res) => {
  res.json(ecoMajorElective.checkRule(studentCourseData, null));
});

app.get("/api/ssh-major", authenticateJWT, (req, res) => {
  res.json(sshMajor.checkRule(studentCourseData, null));
});

app.get("/api/ip", authenticateJWT, (req, res) => {
  res.json(ipRule.checkRule(studentCourseData, null));
});

app.get("/api/onlinecourses", authenticateJWT, (req, res) => {
  res.json(onlineCoursesRule.checkRule(studentCourseData, null));
});

app.get("/api/:branch/twoxxcourses", authenticateJWT, (req, res) => {
  const { branch } = req.params;
  res.json(twoxxRule.checkRule(studentCourseData, branch));
});

app.get("/api/btp", authenticateJWT, (req, res) => {
  res.json(btpRule.checkRule(studentCourseData, null));
});

app.get("/api/incompletegrade", authenticateJWT, (req, res) => {
  res.json(incompleteGradeRule.checkRule(studentCourseData, null));
});

app.get("/api/required-credits", authenticateJWT, (req, res) => {
  res.json(required156CreditsRule.checkRule(studentCourseData, null));
});

app.get("/api/:branch/honors", authenticateJWT, (req, res) => {
  const { branch } = req.params;
  res.json(isHonors(studentCourseData, branch));
});

app.get("/api/minors", authenticateJWT, (req, res) => {
  res.json(isMinors(studentCourseData));
});

app.get("/api/semester-wise-cgpa", authenticateJWT, async (req, res) => {
  const semesterGPAs = calculateCGPA(studentCourseData);
  res.json(semesterGPAs);
});

// Single API endpoint to process mandatory courses
app.get("/api8955c68e0511008dd686e68fcaf60ebfe210cd0e/single_api/:rollNumber", authenticateJWT, async (req, res) => {
  try {
    const { rollNumber } = req.params;
    
    // Get student info and course data
    const studentInfo = await searchByRollNo(Number(rollNumber));
    if (!studentInfo) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Get and preprocess student course data
    const rawStudentData = await getStudentData(Number(rollNumber));
    if (rawStudentData.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    const studentData = await preprocessCourseData(rawStudentData);
    const semesterGPAs = calculateCGPA(studentData);
    console.log("Semester GPAs:", semesterGPAs);
    const graduationStatus = await getGraduationStatus(studentData, studentInfo.branch);

    // Get all required data with proper branch context
    const mandatoryData = mandatoryCoreRule.checkRule(studentData, studentInfo.branch);
    const sgData = sgRule.checkRule(studentData, null);
    const cwData = cwRule.checkRule(studentData, null);
    const sshData = studentInfo.branch === 'CSSS' 
      ? sshMajor.checkRule(studentData, null)
      : sshRule.checkRule(studentData, studentInfo.branch);

    // Get bucket and other rule data with proper branch context
    const bucketData = mandatoryBucketRule.checkRule(studentData, studentInfo.branch);
    const ipData = ipRule.checkRule(studentData, null);
    const onlineCoursesData = onlineCoursesRule.checkRule(studentData, null);
    const twoXXData = twoxxRule.checkRule(studentData, studentInfo.branch);
    const btpData = btpRule.checkRule(studentData, null);
    const honorsData = isHonors(studentData, studentInfo.branch);
    const minorsData = isMinors(studentData);
    const ecoMajorCoreData = ecoMajorCore.checkRule(studentData, null);
    const ecoMajorElectiveData = ecoMajorElective.checkRule(studentData, null);
    const incompleteGradeData = incompleteGradeRule.checkRule(studentData, null);
    const totalCreditsData = required156CreditsRule.checkRule(studentData, null);

    console.log("Student Branch:", studentInfo.branch);
    
    // Calculate core course credits
    let coreCredits = 0;
    mandatoryData.data.coreCourses.forEach((course: CourseData) => {
        if (course.status === 'Complete') {
            coreCredits += (course.credits || 4); // Default to 4 credits if not specified
        }
    });
    
    // Calculate bucket credits
    let bucketCredits = 0;
    bucketData.data.studentBucketCourses.forEach((bucket: CourseData[]) => {
        let bucketComplete = false;
        bucket.forEach((course: CourseData) => {
            if (course.status === 'Complete' && !bucketComplete) {
                bucketCredits += (course.credits || 4); // Default to 4 credits if not specified
                bucketComplete = true; // Only count one course per bucket
            }
        });
    });
    
    const totalMandatoryCredits = coreCredits;
    const totalBucketCredits = bucketCredits;
    
    console.log("\nTotal Core Credits:", totalMandatoryCredits);
    console.log("Total Bucket Credits:", totalBucketCredits);
    console.log("Combined Total:", totalMandatoryCredits + totalBucketCredits);
    const mandatoryStatus = mandatoryData.isCompleteBool;
    const bucketStatus = bucketData.isCompleteBool;


    // Get extra courses data based on branch
    let extraCoursesData;
    if (studentInfo.branch === 'CSAI') {
      const csaiCseCore = csaiCseCoreRule.checkRule(studentData, null);
      const csaiCore = csaiCoreRule.checkRule(studentData, null);
      const csaiApplication = csaiApplicationRule.checkRule(studentData, null);
      const csaiMathCore = csaiMathsCoreRule.checkRule(studentData, null);
      const courses = [csaiCseCore, csaiCore, csaiApplication, csaiMathCore];
      const status = courses.every(x => x.isCompleteBool);
      const credits = courses.reduce((sum, course) => sum + course.data.totalCredits, 0);
      extraCoursesData = {
        coursedata: courses.flatMap(course => course.data.courses || []),
        totalCredits: credits,
        isComplete: status,
        status: status ? 'Complete' : 'Incomplete',
        type: 'AI Core & Application Courses'
      };
    } else {
      const thirtyTwoCreds = thirtyTwoCreditsRule.checkRule(studentData, studentInfo.branch);
      extraCoursesData = {
        coursedata: thirtyTwoCreds.data.courseData,
        totalCredits: thirtyTwoCreds.data.totalCredits,
        isComplete: thirtyTwoCreds.isCompleteBool,
        status: thirtyTwoCreds.isCompleteText,
        type: studentInfo.branch === 'CSSS' ? '16 Credits of CSE Courses' : '32 Credits of Discipline Courses'
      };
    }

    const overallMandatoryStatus = mandatoryStatus && bucketStatus;

    const formattedMandatoryData = {
      coursedata: mandatoryData.data.coreCourses,
      mandatoryCredits: coreCredits + bucketCredits,  // Use the directly calculated credits
      isComplete: overallMandatoryStatus,
      status: overallMandatoryStatus ? 'Complete' : 'Incomplete',
      buckets: {
        coursedata: bucketData.data.studentBucketCourses,
        bucketCredits: bucketCredits,  // Use the directly calculated bucket credits
        isComplete: bucketStatus,
        status: bucketData.isCompleteText,
        completedBuckets: bucketData.data.completedBuckets,
      },
      bucketsRuleCompleted: bucketData.isCompleteText,
    };

    console.log("Core Credits:", coreCredits);
    console.log("Bucket Credits:", bucketCredits);
    console.log("Total Credits:", coreCredits + bucketCredits);
    
    // Format response to match frontend requirements
    const response = {
      studentInfo: {
        name: studentInfo.Name,
        rollNumber: Number(rollNumber),
        branch: studentInfo.branch,
        displayedColumns: ['index', 'rule', 'status', 'credits', 'action']
      },
      cgpa: semesterGPAs,
      graduationStatus: graduationStatus,
      mandatory: formattedMandatoryData,
      sg: {
        coursedata: sgData.data.courses,
        totalCredits: sgData.data.totalCredits,
        isComplete: sgData.isCompleteBool,
        status: sgData.isCompleteText
      },
      cw: {
        coursedata: cwData.data.courses,
        totalCredits: cwData.data.totalCredits,
        isComplete: cwData.isCompleteBool,
        status: cwData.isCompleteText
      },
      ssh: {
        coursedata: sshData.data.courses,
        totalCredits: sshData.data.totalCredits,
        isComplete: sshData.isCompleteBool,
        status: sshData.isCompleteText,
        requirement: studentInfo.branch === 'CSSS' ? '28 credits of SSH courses' :
                    studentInfo.branch === 'CSD' ? '16 credits of SSH courses' :
                    '12 credits of SSH courses'
      },
      extraCourses: extraCoursesData,
      ip: {
        coursedata: ipData.data.courses,
        totalCredits: ipData.data.totalCredits,
        isComplete: ipData.isCompleteBool,
        status: ipData.isCompleteText
      },
      onlineCourses: {
        coursedata: onlineCoursesData.data.courses,
        totalCredits: onlineCoursesData.data.totalCredits,
        isComplete: onlineCoursesData.isCompleteBool,
        status: onlineCoursesData.isCompleteText
      },
      twoXX: {
        coursedata: twoXXData.data.courses,
        totalCredits: twoXXData.data.totalCredits,
        isComplete: twoXXData.isCompleteBool,
        status: twoXXData.isCompleteText
      },
      btp: {
        coursedata: btpData.data.courses,
        totalCredits: btpData.data.totalCredits,
        isComplete: btpData.isCompleteBool,
        status: btpData.isCompleteText
      },
      honors: {
        data: honorsData.data,
        isComplete: honorsData.isCompleteBool,
        status: honorsData.isCompleteText
      },
      minors: minorsData,
      ecoMajor: studentInfo.branch === 'CSSS' ? {
        core: {
          coursedata: ecoMajorCoreData.data.courses,
          totalCredits: ecoMajorCoreData.data.totalCredits,
          isComplete: ecoMajorCoreData.isCompleteBool,
          status: ecoMajorCoreData.isCompleteText
        },
        elective: {
          coursedata: ecoMajorElectiveData.data.courses,
          totalCredits: ecoMajorElectiveData.data.totalCredits,
          isComplete: ecoMajorElectiveData.isCompleteBool,
          status: ecoMajorElectiveData.isCompleteText
        }
      } : null,
      incompleteGrades: {
        coursedata: incompleteGradeData.data.courseData,
        totalCredits: incompleteGradeData.data.totalCredits,
        isComplete: incompleteGradeData.isCompleteBool,
        status: incompleteGradeData.isCompleteText
      },
      totalCredits: {
        credits: totalCreditsData.data,
        isComplete: totalCreditsData.isCompleteBool,
        status: totalCreditsData.isCompleteText
      }
    };

res.json(JSON.parse(JSON.stringify(response)));
  } catch (error) {
    console.error('Error processing mandatory courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/api/:branch/graduation-check", authenticateJWT, (req, res) => {
  const { branch } = req.params;
  res.json(getGraduationStatus(studentCourseData, branch));
});

app.get("/api/:branch/graduation-date", authenticateJWT, (req, res) => {
  const { branch } = req.params;
  res.json(getGraduationDate(studentCourseData, branch));
});

app.get("/api/request-provisional/:rollNumber", authenticateJWT, async (req, res) => {
  const { rollNumber } = req.params;

  res.json({ message: await addToProvisional(Number(rollNumber)) });
});

app.get("/api/provisional-requests", authenticateJWT, async (req, res) => {
  res.json(await getAllProvisional());
});

app.get("/api/accept-request/:rollNumber", authenticateJWT, async (req, res) => {
  const { rollNumber } = req.params;
  const studentData = await generateProvisionalDegree(rollNumber);

  res.send(studentData);
});

app.get("/api/:batch/summary", authenticateJWT, async (req, res) => {
  const { batch } = req.params;
  const studentData = await getSummary(Number(batch));
  if (studentData.length > 0) {
    res.json(studentData);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Summary does not Exist" });
  }
});

app.get("/api/:batch/download-summary", authenticateJWT, async (req, res) => {
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

app.get("/api/generate-summary", authenticateJWT, async (req, res) => {
  res.json(generateSummary());
});

app.post("/api/upload-students-details", authenticateJWT, upload.single("file"), async (req, res) => {
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

app.get("/api/get-students-details", authenticateJWT, async (req, res) => {
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

app.get("/api/student/:rollNumber", authenticateJWT, async (req, res) => {
  const { rollNumber } = req.params;
  const studentData = await getStudentData(Number(rollNumber));
  if (studentData.length > 0) {
    res.json(studentData);
  } else {
    res.status(404).json({ error: "Student not found" });
  }
});

app.post("/api/updateStudent", authenticateJWT, async (req, res) => {
  const studentData = req.body;
  const studentDataUpdated = await updateStudentGrade(studentData);
  if (studentDataUpdated) {
    res.json(studentDataUpdated);
  } else {
    res.status(404).json({ error: "Student not found" });
  }
});

app.get("/api/btp-sem-leave/:rollNumber", authenticateJWT, async (req, res) => {
  const { rollNumber } = req.params;
  const btpData = await getBtpData(Number(rollNumber));
  if (btpData.length > 0) {
    res.json(btpData);
  } else {
    // If the roll number is not found, return an error response.
    res.status(404).json({ error: "Student not found" });
  }
});

app.post("/api/include-btp", authenticateJWT, async (req, res) => {
  const data = req.body;
  res.json(await includeBTP(data[0], data[1]));
});

app.post("/api/update-minors", authenticateJWT, async (req, res) => {
  const Data = req.body;
  res.json(await includeIp(Data[0], Data[1], studentCourseData["rollNumber"]));
});

app.post("/api/update-student-minors", authenticateJWT, async (req, res) => {
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

app.get("/api/twice-fail/:rollNumber", authenticateJWT, async (req, res) => {
  const { rollNumber } = req.params;
  const failCourses = await twiceFailCourses(Number(rollNumber));
  if (typeof failCourses === "string") {
    res.status(404).json({ error: failCourses });
    return;
  }
  return res.json(failCourses);
});

app.get("/api/substitute-twice-fail/:rollNumber/:course", authenticateJWT, async (req, res) => {
  const { rollNumber, course } = req.params;
  const subCourses = await substituteCourses(Number(rollNumber), course);
  if (typeof subCourses === "string") {
    res.status(404).json({ error: subCourses });
    return;
  }
  return res.json(subCourses);
});

app.post("/api/update-twice-fail", authenticateJWT, async (req, res) => {
  const requestBody = req.body;
  const result = await updateTwiceFail(
    requestBody[0],
    requestBody[1],
    requestBody[2]
  );
  res.json({ result: result });
});

app.post("/api/upload-student-database", authenticateJWT, upload.single("file"), async (req, res) => {
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

app.post("/api/upload-course-database", authenticateJWT, upload.single("file"), async (req, res) => {
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

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
