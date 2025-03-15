"use strict";
// This file contains the server code for the backend of the Graduation Checklist application.Is is used to handle the API requests from the frontend and interact with the database.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const xlsx_1 = __importDefault(require("xlsx"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const securityMiddleware_1 = require("./middleware/securityMiddleware");
const rule_1 = require("./rule");
const degree_1 = require("./degree");
const cgpa_1 = require("./cgpa");
const honors_1 = require("./honors");
const minors_1 = require("./minors");
const database_1 = require("./database");
const rule_2 = require("./rule");
const app = (0, express_1.default)();
const port = 3002;
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
let studentCourseData = {
    studentName: "",
    program: "",
    rollNumber: 0,
    batch: 0,
    courses: [],
};
// Apply security middleware
app.use(securityMiddleware_1.securityHeaders);
app.use(securityMiddleware_1.corsConfig);
app.use(securityMiddleware_1.rateLimiter);
app.use(securityMiddleware_1.csrfProtection);
app.use(express_1.default.json());
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
        const token = jsonwebtoken_1.default.sign({ userId: username, role: 'admin' }, process.env.JWT_SECRET);
        res.json({ token });
    }
    else {
        res.status(404).json({ error: "User not found" });
    }
});
app.post("/api/student-login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const rollNo = yield (0, database_1.checkCredentials)(username, password);
    if (rollNo) {
        const token = jsonwebtoken_1.default.sign({ userId: rollNo, role: 'student' }, process.env.JWT_SECRET);
        res.json({ token });
    }
    else {
        res.status(404).json({ error: "Wrong Credentials" });
    }
}));
app.get("/api/:rollNumber/info", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rollNumber } = req.params;
    const studentInfo = yield (0, database_1.searchByRollNo)(Number(rollNumber));
    if (studentInfo) {
        res.json(studentInfo);
    }
    else {
        res.status(404).json({ error: "Student not found" });
    }
}));
app.get("/api/:rollNumber/checklist", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rollNumber } = req.params;
    const studentInfo = yield (0, database_1.searchByRollNo)(Number(rollNumber));
    if (!studentInfo) {
        res.status(404).json({ error: "Student not found" });
        return;
    }
    try {
        const studentData = yield (0, database_1.preprocessCourseData)(yield (0, database_1.getStudentData)(Number(rollNumber)));
        const checklistResults = rule_1.allRules.map(rule => ({
            ruleId: rule.ruleId,
            result: rule.checkRule(studentData, studentInfo.program)
        }));
        res.json({
            studentInfo,
            checklistResults
        });
    }
    catch (error) {
        console.error("Error processing checklist:", error);
        res.status(500).json({ error: "Error processing checklist" });
    }
}));
app.get("/api/:rollNumber/courseinfo", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rollNumber } = req.params;
    const studentInfo = yield (0, database_1.searchByRollNo)(Number(rollNumber));
    if (studentInfo) {
        studentCourseData = yield (0, database_1.preprocessCourseData)(yield (0, database_1.getStudentData)(Number(rollNumber)));
        res.json(studentInfo);
    }
    else {
        res.status(404).json({ error: "Student not found" });
    }
}));
app.get("/api/:branch/mandatory", securityMiddleware_1.authenticateJWT, (req, res) => {
    // Get the branch parameter from the request URL.
    const { branch } = req.params;
    res.json(rule_2.mandatoryCoreRule.checkRule(studentCourseData, branch));
});
app.get("/api/:branch/bucket", securityMiddleware_1.authenticateJWT, (req, res) => {
    // Get the branch parameter from the request URL.
    const { branch } = req.params;
    res.json(rule_2.mandatoryBucketRule.checkRule(studentCourseData, branch));
});
app.get("/api/:branch/ssh", securityMiddleware_1.authenticateJWT, (req, res) => {
    // Get the branch parameter from the request URL.
    const { branch } = req.params;
    res.json(rule_2.sshRule.checkRule(studentCourseData, branch));
});
app.get("/api/cw", securityMiddleware_1.authenticateJWT, (req, res) => {
    res.json(rule_2.cwRule.checkRule(studentCourseData, null));
});
app.get("/api/sg", securityMiddleware_1.authenticateJWT, (req, res) => {
    res.json(rule_2.sgRule.checkRule(studentCourseData, null));
});
app.get("/api/:branch/thirtytwocredits", securityMiddleware_1.authenticateJWT, (req, res) => {
    const { branch } = req.params;
    res.json(rule_2.thirtyTwoCreditsRule.checkRule(studentCourseData, branch));
});
app.get("/api/csai", securityMiddleware_1.authenticateJWT, (req, res) => {
    const csaiCseCore = rule_2.csaiCseCoreRule.checkRule(studentCourseData, null);
    const csaiCore = rule_2.csaiCoreRule.checkRule(studentCourseData, null);
    const csaiApplication = rule_2.csaiApplicationRule.checkRule(studentCourseData, null);
    const csaiMathCore = rule_2.csaiMathsCoreRule.checkRule(studentCourseData, null);
    const courses = [csaiCseCore, csaiCore, csaiApplication, csaiMathCore];
    const status = courses.every(x => x.isCompleteBool);
    const credits = courses.reduce((sum, course) => sum + course.data.totalCredits, 0);
    const responseJson = {
        courses: courses,
        isCompleteBool: status,
        isCompleteText: status ? 'Complete' : 'Incomplete',
        totalCredits: credits
    };
    res.json(responseJson);
});
app.get("/api/eco-major-core", securityMiddleware_1.authenticateJWT, (req, res) => {
    res.json(rule_2.ecoMajorCore.checkRule(studentCourseData, null));
});
app.get("/api/eco-major-elective", securityMiddleware_1.authenticateJWT, (req, res) => {
    res.json(rule_2.ecoMajorElective.checkRule(studentCourseData, null));
});
app.get("/api/ssh-major", securityMiddleware_1.authenticateJWT, (req, res) => {
    res.json(rule_2.sshMajor.checkRule(studentCourseData, null));
});
app.get("/api/ip", securityMiddleware_1.authenticateJWT, (req, res) => {
    res.json(rule_2.ipRule.checkRule(studentCourseData, null));
});
app.get("/api/onlinecourses", securityMiddleware_1.authenticateJWT, (req, res) => {
    res.json(rule_2.onlineCoursesRule.checkRule(studentCourseData, null));
});
app.get("/api/:branch/twoxxcourses", securityMiddleware_1.authenticateJWT, (req, res) => {
    const { branch } = req.params;
    res.json(rule_2.twoxxRule.checkRule(studentCourseData, branch));
});
app.get("/api/btp", securityMiddleware_1.authenticateJWT, (req, res) => {
    res.json(rule_2.btpRule.checkRule(studentCourseData, null));
});
app.get("/api/incompletegrade", securityMiddleware_1.authenticateJWT, (req, res) => {
    res.json(rule_2.incompleteGradeRule.checkRule(studentCourseData, null));
});
app.get("/api/required-credits", securityMiddleware_1.authenticateJWT, (req, res) => {
    res.json(rule_2.required156CreditsRule.checkRule(studentCourseData, null));
});
app.get("/api/:branch/honors", securityMiddleware_1.authenticateJWT, (req, res) => {
    const { branch } = req.params;
    res.json((0, honors_1.isHonors)(studentCourseData, branch));
});
app.get("/api/minors", securityMiddleware_1.authenticateJWT, (req, res) => {
    res.json((0, minors_1.isMinors)(studentCourseData));
});
app.get("/api/semester-wise-cgpa", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const semesterGPAs = (0, cgpa_1.calculateCGPA)(studentCourseData);
    res.json(semesterGPAs);
}));
// Single API endpoint to process mandatory courses
app.get("/api8955c68e0511008dd686e68fcaf60ebfe210cd0e/single_api/:rollNumber", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rollNumber } = req.params;
        // Get student info and course data
        const studentInfo = yield (0, database_1.searchByRollNo)(Number(rollNumber));
        if (!studentInfo) {
            return res.status(404).json({ error: "Student not found" });
        }
        // Get and preprocess student course data
        const rawStudentData = yield (0, database_1.getStudentData)(Number(rollNumber));
        if (rawStudentData.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        const studentData = yield (0, database_1.preprocessCourseData)(rawStudentData);
        const semesterGPAs = (0, cgpa_1.calculateCGPA)(studentData);
        console.log("Semester GPAs:", semesterGPAs);
        const graduationStatus = yield (0, degree_1.getGraduationStatus)(studentData, studentInfo.branch);
        // Get all required data with proper branch context
        const mandatoryData = rule_2.mandatoryCoreRule.checkRule(studentData, studentInfo.branch);
        const sgData = rule_2.sgRule.checkRule(studentData, null);
        const cwData = rule_2.cwRule.checkRule(studentData, null);
        const sshData = studentInfo.branch === 'CSSS'
            ? rule_2.sshMajor.checkRule(studentData, null)
            : rule_2.sshRule.checkRule(studentData, studentInfo.branch);
        // Get bucket and other rule data with proper branch context
        const bucketData = rule_2.mandatoryBucketRule.checkRule(studentData, studentInfo.branch);
        const ipData = rule_2.ipRule.checkRule(studentData, null);
        const onlineCoursesData = rule_2.onlineCoursesRule.checkRule(studentData, null);
        const twoXXData = rule_2.twoxxRule.checkRule(studentData, studentInfo.branch);
        const btpData = rule_2.btpRule.checkRule(studentData, null);
        const honorsData = (0, honors_1.isHonors)(studentData, studentInfo.branch);
        const minorsData = (0, minors_1.isMinors)(studentData);
        const ecoMajorCoreData = rule_2.ecoMajorCore.checkRule(studentData, null);
        const ecoMajorElectiveData = rule_2.ecoMajorElective.checkRule(studentData, null);
        const incompleteGradeData = rule_2.incompleteGradeRule.checkRule(studentData, null);
        const totalCreditsData = rule_2.required156CreditsRule.checkRule(studentData, null);
        console.log("Student Branch:", studentInfo.branch);
        // Calculate core course credits
        let coreCredits = 0;
        mandatoryData.data.coreCourses.forEach((course) => {
            if (course.status === 'Complete') {
                coreCredits += (course.credits || 4); // Default to 4 credits if not specified
            }
        });
        // Calculate bucket credits
        let bucketCredits = 0;
        bucketData.data.studentBucketCourses.forEach((bucket) => {
            let bucketComplete = false;
            bucket.forEach((course) => {
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
            const csaiCseCore = rule_2.csaiCseCoreRule.checkRule(studentData, null);
            const csaiCore = rule_2.csaiCoreRule.checkRule(studentData, null);
            const csaiApplication = rule_2.csaiApplicationRule.checkRule(studentData, null);
            const csaiMathCore = rule_2.csaiMathsCoreRule.checkRule(studentData, null);
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
        }
        else {
            const thirtyTwoCreds = rule_2.thirtyTwoCreditsRule.checkRule(studentData, studentInfo.branch);
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
            mandatoryCredits: coreCredits + bucketCredits, // Use the directly calculated credits
            isComplete: overallMandatoryStatus,
            status: overallMandatoryStatus ? 'Complete' : 'Incomplete',
            buckets: {
                coursedata: bucketData.data.studentBucketCourses,
                bucketCredits: bucketCredits, // Use the directly calculated bucket credits
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
    }
    catch (error) {
        console.error('Error processing mandatory courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.get("/api/:branch/graduation-check", securityMiddleware_1.authenticateJWT, (req, res) => {
    const { branch } = req.params;
    res.json((0, degree_1.getGraduationStatus)(studentCourseData, branch));
});
app.get("/api/:branch/graduation-date", securityMiddleware_1.authenticateJWT, (req, res) => {
    const { branch } = req.params;
    res.json((0, degree_1.getGraduationDate)(studentCourseData, branch));
});
app.get("/api/request-provisional/:rollNumber", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rollNumber } = req.params;
    res.json({ message: yield (0, database_1.addToProvisional)(Number(rollNumber)) });
}));
app.get("/api/provisional-requests", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield (0, database_1.getAllProvisional)());
}));
app.get("/api/accept-request/:rollNumber", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rollNumber } = req.params;
    const studentData = yield (0, database_1.generateProvisionalDegree)(rollNumber);
    res.send(studentData);
}));
app.get("/api/:batch/summary", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { batch } = req.params;
    const studentData = yield (0, database_1.getSummary)(Number(batch));
    if (studentData.length > 0) {
        res.json(studentData);
    }
    else {
        // If the roll number is not found, return an error response.
        res.status(404).json({ error: "Summary does not Exist" });
    }
}));
app.get("/api/:batch/download-summary", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { batch } = req.params;
    const studentData = yield (0, database_1.getSummary)(Number(batch));
    const workbook = xlsx_1.default.utils.book_new();
    const sheet = xlsx_1.default.utils.json_to_sheet(studentData);
    xlsx_1.default.utils.book_append_sheet(workbook, sheet, "StudentSummary");
    const excelBuffer = xlsx_1.default.write(workbook, { type: "buffer" });
    if (studentData.length > 0) {
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=studentsInfo.xlsx");
        res.send(excelBuffer);
    }
    else {
        // If the roll number is not found, return an error response.
        res.status(404).json({ error: "Summary does not Exist" });
    }
}));
app.get("/api/generate-summary", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json((0, database_1.generateSummary)());
}));
app.post("/api/upload-students-details", securityMiddleware_1.authenticateJWT, upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fileBuffer = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
    if (fileBuffer) {
        const result = yield (0, database_1.updateStudentDetails)(fileBuffer);
        if (result == 1) {
            res.status(200).json({ message: "File uploaded successfully" });
        }
        else if (result == 0) {
            res.status(400).json({ error: "No new entry to add" });
        }
        else {
            res.status(400).json({ error: "File Uploading failed" });
        }
    }
    else {
        res.status(400).json({ error: "Invalid file or no file provided" });
    }
}));
app.get("/api/get-students-details", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const excelBuffer = yield (0, database_1.sendPasswords)();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=studentsInfo.xlsx");
    res.send(excelBuffer);
}));
app.get("/api/student/:rollNumber", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rollNumber } = req.params;
    const studentData = yield (0, database_1.getStudentData)(Number(rollNumber));
    if (studentData.length > 0) {
        res.json(studentData);
    }
    else {
        res.status(404).json({ error: "Student not found" });
    }
}));
app.post("/api/updateStudent", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentData = req.body;
    const studentDataUpdated = yield (0, database_1.updateStudentGrade)(studentData);
    if (studentDataUpdated) {
        res.json(studentDataUpdated);
    }
    else {
        res.status(404).json({ error: "Student not found" });
    }
}));
app.get("/api/btp-sem-leave/:rollNumber", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rollNumber } = req.params;
    const btpData = yield (0, database_1.getBtpData)(Number(rollNumber));
    if (btpData.length > 0) {
        res.json(btpData);
    }
    else {
        // If the roll number is not found, return an error response.
        res.status(404).json({ error: "Student not found" });
    }
}));
app.post("/api/include-btp", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    res.json(yield (0, database_1.includeBTP)(data[0], data[1]));
}));
app.post("/api/update-minors", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Data = req.body;
    res.json(yield (0, minors_1.includeIp)(Data[0], Data[1], studentCourseData["rollNumber"]));
}));
app.post("/api/update-student-minors", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rollNumber, type } = req.body;
    const studentData = yield (0, database_1.getStudentData)(Number(rollNumber));
    // Check if the roll number exists in the database.
    if (studentData.length <= 0) {
        res.status(404).json({ error: "Student not found" });
        return;
    }
    studentCourseData = yield (0, database_1.preprocessCourseData)(studentData);
    if (type === "IP" || type === "BTP") {
        res.json(yield (0, minors_1.checkIpBtpForMinors)(studentCourseData, type));
    }
    else if (type === "Apprenticeship") {
        res.json(yield (0, minors_1.approveApprenticeship)(studentCourseData));
    }
}));
app.get("/api/twice-fail/:rollNumber", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rollNumber } = req.params;
    const failCourses = yield (0, database_1.twiceFailCourses)(Number(rollNumber));
    if (typeof failCourses === "string") {
        res.status(404).json({ error: failCourses });
        return;
    }
    return res.json(failCourses);
}));
app.get("/api/substitute-twice-fail/:rollNumber/:course", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rollNumber, course } = req.params;
    const subCourses = yield (0, database_1.substituteCourses)(Number(rollNumber), course);
    if (typeof subCourses === "string") {
        res.status(404).json({ error: subCourses });
        return;
    }
    return res.json(subCourses);
}));
app.post("/api/update-twice-fail", securityMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestBody = req.body;
    const result = yield (0, database_1.updateTwiceFail)(requestBody[0], requestBody[1], requestBody[2]);
    res.json({ result: result });
}));
app.post("/api/upload-student-database", securityMiddleware_1.authenticateJWT, upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const fileBuffer = (_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer;
    if (fileBuffer) {
        const result = yield (0, database_1.updateStudentDatabase)(fileBuffer);
        if (result) {
            res.status(200).json({ message: "File uploaded successfully" });
        }
        else {
            res.status(400).json({ error: "File Uploading failed" });
        }
    }
    else {
        res.status(400).json({ error: "Invalid file or no file provided" });
    }
}));
app.post("/api/upload-course-database", securityMiddleware_1.authenticateJWT, upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const fileBuffer = (_c = req.file) === null || _c === void 0 ? void 0 : _c.buffer;
    const originalFileName = (_d = req.file) === null || _d === void 0 ? void 0 : _d.originalname;
    if (fileBuffer && originalFileName) {
        const result = (0, database_1.updateCourseDatabase)(fileBuffer, originalFileName);
        if (result) {
            res.status(200).json({ message: "File uploaded successfully" });
        }
        else {
            res.status(400).json({ error: "File Uploading failed" });
        }
    }
    else {
        res.status(400).json({ error: "Invalid file or no file provided" });
    }
}));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
exports.default = app;
