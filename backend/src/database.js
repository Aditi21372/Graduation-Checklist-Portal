"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTwiceFail = exports.substituteCourses = exports.twiceFailCourses = exports.generateProvisionalDegree = exports.getAllProvisional = exports.addToProvisional = exports.includeBTP = exports.getBtpData = exports.checkCredentials = exports.sendPasswords = exports.getSummary = exports.generateSummary = exports.updateStudentDetails = exports.updateCourseDatabase = exports.updateStudentDatabase = exports.updateStudentGrade = exports.getStudentData = exports.searchByRollNo = exports.getGraduatedStudents = exports.getCourseDatabase = exports.preprocessCourseData = exports.courseDatabase = void 0;
const xlsx = __importStar(require("xlsx"));
const fs = __importStar(require("fs"));
const db_1 = require("./db");
const degree_1 = require("./degree");
const xlx = require("xlsx");
const rule_1 = require("./rule");
const cgpa_1 = require("./cgpa");
const honors_1 = require("./honors");
const minors_1 = require("./minors");
exports.courseDatabase = {};
function preprocessCourseData(studentData) {
    return __awaiter(this, void 0, void 0, function* () {
        const student = yield searchByRollNo(studentData[0]["Roll No"]);
        const studentInfo = {
            studentName: student["Name"],
            rollNumber: studentData[0]["Roll No"],
            program: student["branch"],
            batch: studentData[0]["Batch"],
            courses: [],
        };
        studentData.forEach((entry) => {
            const course = {
                courseCode: entry["Course Code"],
                course: entry["Course"],
                grade: entry["Grade"],
                semester: entry["Batch / Term Code"],
                credit: entry["Credit"],
                includedInMinors: entry["IncludedInMinors"],
            };
            studentInfo.courses.push(course);
        });
        exports.courseDatabase = getCourseDatabase(studentData[0]["Batch"].toString());
        return studentInfo;
    });
}
exports.preprocessCourseData = preprocessCourseData;
function getCourseDatabase(batch) {
    const filePath = `src/data/${batch}.json`;
    const courseDatabase = {};
    let data = fs.readFileSync(filePath);
    const jsonData = JSON.parse(data.toString());
    for (const category in jsonData) {
        if (jsonData.hasOwnProperty(category)) {
            const courses = jsonData[category];
            courseDatabase[category] = courses;
        }
    }
    return courseDatabase;
}
exports.getCourseDatabase = getCourseDatabase;
function getGraduatedStudents(filePath) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const range = xlx.utils.decode_range(worksheet["!ref"]);
    const graduatedStudents = [];
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
        const student = {
            sNo: (_a = worksheet[`A${row + 1}`]) === null || _a === void 0 ? void 0 : _a.v,
            programSeq: (_b = worksheet[`B${row + 1}`]) === null || _b === void 0 ? void 0 : _b.v,
            rollNo: (_c = worksheet[`C${row + 1}`]) === null || _c === void 0 ? void 0 : _c.v,
            name: (_d = worksheet[`D${row + 1}`]) === null || _d === void 0 ? void 0 : _d.v,
            program: (_e = worksheet[`E${row + 1}`]) === null || _e === void 0 ? void 0 : _e.v,
            graduationDate: (_f = worksheet[`F${row + 1}`]) === null || _f === void 0 ? void 0 : _f.v,
            honors: (_g = worksheet[`G${row + 1}`]) === null || _g === void 0 ? void 0 : _g.v,
            minorInCB: (_h = worksheet[`H${row + 1}`]) === null || _h === void 0 ? void 0 : _h.v,
            minorInEco: (_j = worksheet[`I${row + 1}`]) === null || _j === void 0 ? void 0 : _j.v,
            minorInENT: (_k = worksheet[`J${row + 1}`]) === null || _k === void 0 ? void 0 : _k.v,
            minorInQuantum: (_l = worksheet[`K${row + 1}`]) === null || _l === void 0 ? void 0 : _l.v,
            minorInDesign: (_m = worksheet[`K${row + 1}`]) === null || _m === void 0 ? void 0 : _m.v,
            ecoMajor: (_o = worksheet[`L${row + 1}`]) === null || _o === void 0 ? void 0 : _o.v,
            btp: (_p = worksheet[`M${row + 1}`]) === null || _p === void 0 ? void 0 : _p.v,
            credits: (_q = worksheet[`N${row + 1}`]) === null || _q === void 0 ? void 0 : _q.v,
            cgpa: (_r = worksheet[`O${row + 1}`]) === null || _r === void 0 ? void 0 : _r.v,
        };
        graduatedStudents.push(student);
    }
    return graduatedStudents;
}
exports.getGraduatedStudents = getGraduatedStudents;
function searchByRollNo(rollNo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = db_1.db.collection("studentsInfo");
            const query = { "Roll No": rollNo };
            const result = yield collection.findOne(query);
            if (result === null || result.aknowledged === 0) {
                return null;
            }
            const studentInfo = {
                "Roll No": result["Roll No"],
                Name: result["Full Name"],
                branch: result["branch"],
            };
            return studentInfo;
        }
        catch (err) {
            console.error(err);
            return [];
        }
    });
}
exports.searchByRollNo = searchByRollNo;
function getStudentData(rollNo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = db_1.db.collection("studentsGrade");
            // Use the find method to retrieve all documents matching the query
            const query = { "Roll No": rollNo };
            const result = yield collection.find(query).toArray();
            if (result.length === 0) {
                return []; // Return an empty array
            }
            return result;
        }
        catch (err) {
            console.error(err);
            return [];
        }
    });
}
exports.getStudentData = getStudentData;
function updateStudentGrade(studentData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = db_1.db.collection("studentsGrade");
            // Use the find method to retrieve all documents matching the query
            const query = {
                "Roll No": studentData["Roll No"],
                "Batch / Term Code": studentData["Batch / Term Code"],
                "Course Code": studentData["Course Code"],
                "Grade": { $ne: studentData["Grade"] }
            };
            const existingStudent = yield collection.findOne(query);
            if (!existingStudent) {
                return []; // Student not found
            }
            existingStudent["Grade"] = studentData["Grade"];
            const result = yield collection.replaceOne(query, existingStudent);
            if (result.modifiedCount === 0) {
                return []; // Document not updated
            }
            return existingStudent; // Document updated successfully
        }
        catch (err) {
            console.error(err);
            return [];
        }
    });
}
exports.updateStudentGrade = updateStudentGrade;
function updateStudentDatabase(fileBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const workbook = xlsx.read(fileBuffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        const updatedData = data.map((entry) => (Object.assign(Object.assign({}, entry), { Batch: parseInt(entry["Batch"]), "Roll No": parseInt(entry["Roll No"]), Credit: parseInt(entry["Credit"]), "Batch / Term Code": formatTermCode(entry["Batch / Term Code"]), IncludedInMinors: "No" })));
        try {
            const collection = db_1.db.collection("studentsGrade");
            const result = yield collection.insertMany(updatedData);
            return result.acknowledged;
        }
        catch (error) {
            console.error("Error inserting data into MongoDB:", error);
            throw error;
        }
    });
}
exports.updateStudentDatabase = updateStudentDatabase;
function updateCourseDatabase(fileBuffer, fileName) {
    try {
        const workbook = xlsx.read(fileBuffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const range = xlx.utils.decode_range(sheet["!ref"]);
        // Convert Excel sheet to JSON with column headings
        const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        const data = {}; // Add index signature to the data object
        for (let col = range.s.c; col <= range.e.c; col++) {
            let colHeader = jsonData[0][col];
            data[colHeader] = [];
            for (let row = range.s.r + 1; row <= range.e.r; row++) {
                let cell = sheet[xlsx.utils.encode_cell({ r: row, c: col })];
                // Checks if the cell exists.
                if (cell) {
                    data[colHeader].push(cell.v);
                }
            }
        }
        // Generate output file name based on the original file name
        const path = "src/data/";
        const outputFileName = path + fileName.replace(/\.[^/.]+$/, "") + ".json";
        // Save JSON to a file with the generated file name
        fs.writeFileSync(outputFileName, JSON.stringify(data, null, 2));
        return true;
    }
    catch (error) {
        console.error("Error processing file:", error);
        return false;
    }
}
exports.updateCourseDatabase = updateCourseDatabase;
function formatTermCode(termCode) {
    if (termCode.toString().includes("Semester")) {
        return termCode.replace("Semester ", "").trim();
    }
    return termCode;
}
function updateStudentDetails(fileBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const workbook = xlsx.read(fileBuffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        // Retrieve existing roll numbers from the database
        const existingRollNumbers = yield getExistingRollNumbers();
        const updatedData = data
            .filter((entry) => {
            // Filter out entries with roll numbers that already exist in the database
            return !existingRollNumbers.includes(entry["Roll No"]);
        })
            .map((entry) => (Object.assign(Object.assign({}, entry), { Password: generateRandomPassword(), branch: mapProgramToBranch(entry["program Specialization"]), prefix: entry["Gender"] == "Male" ? "Mr" : "Ms" })));
        if (updatedData.length === 0) {
            return 0; // Or handle this case as needed
        }
        try {
            const collection = db_1.db.collection("studentsInfo");
            const result = yield collection.insertMany(updatedData);
            if (result.acknowledged) {
                return 1;
            }
            return -1;
        }
        catch (error) {
            console.error("Error inserting data into MongoDB:", error);
            return -1;
        }
    });
}
exports.updateStudentDetails = updateStudentDetails;
// Function to retrieve existing roll numbers from the database
function getExistingRollNumbers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = db_1.db.collection("studentsInfo");
            const existingRollNumbers = yield collection.distinct("Roll No");
            return existingRollNumbers;
        }
        catch (error) {
            console.error("Error retrieving existing roll numbers:", error);
            throw error;
        }
    });
}
function generateSummary() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const studentsCollection = db_1.db.collection("studentsInfo");
            // Fetch all students' information from studentsInfo collection
            const studentsInfo = yield studentsCollection.find({}).toArray();
            // Loop through each student
            for (const student of studentsInfo) {
                // Extract student's information from studentsGrade collection
                const studentData = yield getStudentData(Number(student["Roll No"]));
                if (studentData.length === 0) {
                    continue;
                }
                const studentCourseData = yield preprocessCourseData(studentData);
                const branch = studentCourseData["program"];
                // if (!getGraduationStatus(studentCourseData, branch)) {
                //   continue;
                // }
                yield calculateSummary(studentCourseData, branch);
            }
            return "Summary generation completed.";
        }
        catch (error) {
            console.error("Error generating summary:", error);
            throw error;
        }
    });
}
exports.generateSummary = generateSummary;
function calculateSummary(studentCourseData, branch) {
    return __awaiter(this, void 0, void 0, function* () {
        const credits = rule_1.required156CreditsRule.checkRule(studentCourseData, null);
        const gradDate = (0, degree_1.getGraduationDate)(studentCourseData, branch);
        const gpa = (0, cgpa_1.calculateCGPA)(studentCourseData);
        const btp = rule_1.btpRule.checkRule(studentCourseData, null);
        const honors = (0, honors_1.isHonors)(studentCourseData, branch);
        const minors = (0, minors_1.isMinors)(studentCourseData);
        const majorCore = rule_1.ecoMajorCore.checkRule(studentCourseData, null);
        const majorElective = rule_1.ecoMajorElective.checkRule(studentCourseData, null);
        const summary = {
            Batch: studentCourseData.batch,
            Name: studentCourseData.studentName,
            "Roll No": studentCourseData.rollNumber,
            "Branch": branch,
            "Graduation Date": gradDate,
            "Total Credits": credits.data,
            CGPA: gpa["10"].cgpa,
            BTP: btp.isCompleteText === "Complete" ? "Yes" : "No",
            Honors: honors.isCompleteText === "Done" ? "Yes" : "No",
            "ECO Minors": "No",
            "CB Minors": "No",
            "ENT Minors": "No",
            "Quantum Minors": "No",
            "Design Minors": "No",
            "ECO Major": majorCore.isCompleteBool && majorElective.isCompleteBool ? "Yes" : "No",
        };
        for (let i = 0; i < minors.length; i++) {
            if (minors[i].isCompleteText === "Complete") {
                if (minors[i].data.stream === "Economics") {
                    summary["ECO Minors"] = "Yes";
                }
                else if (minors[i].data.stream === "Computational Biology") {
                    summary["CB Minors"] = "Yes";
                }
                else if (minors[i].data.stream === "Entrepreneurship") {
                    summary["ENT Minors"] = "Yes";
                }
                else if (minors[i].data.stream === "Quantum") {
                    summary["Quantum Minors"] = "Yes";
                }
                else if (minors[i].data.stream === "Design") {
                    summary["Design Minors"] = "Yes";
                }
            }
        }
        try {
            const graduationSummaryCollection = db_1.db.collection("graduationSummary");
            const existingDocument = yield graduationSummaryCollection.findOne({
                "Roll No": studentCourseData.rollNumber,
            });
            if (existingDocument) {
                // If document with same Roll No exists, update it
                yield graduationSummaryCollection.updateOne({ _id: existingDocument._id }, { $set: summary });
            }
            else {
                // If no document with same Roll No exists, insert new document
                yield graduationSummaryCollection.insertOne(summary);
            }
        }
        catch (error) {
            console.error("Error inserting data into MongoDB:", error);
            throw error;
        }
    });
}
function getSummary(batch) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = db_1.db.collection("graduationSummary");
            const query = { Batch: batch };
            const result = yield collection.find(query).toArray();
            return result;
        }
        catch (error) {
            console.error("Error fetching data from MongoDB:", error);
            throw error;
        }
    });
}
exports.getSummary = getSummary;
function generateRandomPassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@";
    let password = "";
    const length = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}
function sendPasswords() {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = db_1.db.collection("studentsInfo");
        const cursor = collection.find({});
        const data = yield cursor.toArray();
        const workbook = xlsx.utils.book_new();
        const sheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, sheet, "StudentsInfo");
        const excelBuffer = xlsx.write(workbook, { type: "buffer" });
        return excelBuffer;
    });
}
exports.sendPasswords = sendPasswords;
function checkCredentials(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = db_1.db.collection("studentsInfo");
            const query = { "Primary Email Id": username, Password: password };
            const result = yield collection.findOne(query);
            if (result !== null) {
                return result["Roll No"];
            }
            return null;
        }
        catch (error) {
            console.error("Error fetching data from MongoDB:", error);
            throw error;
        }
    });
}
exports.checkCredentials = checkCredentials;
function mapProgramToBranch(program) {
    switch (program) {
        case "Electronics and Communication Engineering":
            return "ECE";
        // case "Electronics and VLSI Engineering":
        //     return "EVE";
        case "Computer Science and Applied Mathematics":
            return "CSAM";
        case "Computer Science and Engineering":
            return "CSE";
        case "Computer Science and Design":
            return "CSD";
        case "Computer Science and Social Sciences":
            return "CSSS";
        case "Computer Science and Biosciences":
            return "CSB";
        case "Computer Science and Artificial Intelligence":
            return "CSAI";
        case "Information Technology and Social Sciences":
            return "CSSS";
        default:
            return "";
    }
}
function getBtpData(rollNo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = db_1.db.collection("studentsGrade");
            const query = {
                "Roll No": rollNo,
                "Course Code": /^BTP/,
                Grade: { $nin: ["W", "F", "I"] },
            };
            const result = yield collection.find(query).toArray();
            if (result.length === 0) {
                return []; // Return an empty array
            }
            return result;
        }
        catch (err) {
            console.error(err);
            return [];
        }
    });
}
exports.getBtpData = getBtpData;
function includeBTP(btpData, rollNo) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            "Roll No": rollNo,
            "Course Code": btpData["Course Code"],
            "Batch / Term Code": btpData["Batch / Term Code"],
        };
        const update = {
            $set: {
                IncludedInMinors: "BTP",
            },
        };
        const collection = db_1.db.collection("studentsGrade");
        try {
            const result = yield collection.updateOne(query, update);
            return result;
        }
        catch (error) {
            console.error("Error updating IncludedInMinors:", error);
            throw error;
        }
    });
}
exports.includeBTP = includeBTP;
function addToProvisional(rollNo) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = db_1.db.collection("provisionalRequests");
        const query = { "Roll No": rollNo };
        if (yield collection.findOne(query)) {
            return "Request already exists";
        }
        try {
            yield collection.insertOne({ "Roll No": rollNo });
            return "Request In Progress";
        }
        catch (error) {
            console.error("Error adding to provisional requests:", error);
            return "Error adding to provisional requests";
        }
    });
}
exports.addToProvisional = addToProvisional;
function getAllProvisional() {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = db_1.db.collection("provisionalRequests");
        try {
            const result = yield collection.find({}).toArray();
            return result;
        }
        catch (error) {
            console.error("Error fetching provisional requests:", error);
            throw error;
        }
    });
}
exports.getAllProvisional = getAllProvisional;
function generateProvisionalDegree(rollNo) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = db_1.db.collection("studentsInfo");
        const query = { "Roll No": Number(rollNo) };
        try {
            const student = yield collection.findOne(query);
            if (!student) {
                return "Student not found";
            }
            const data = {
                Prefix: student.prefix,
                "Full Name": student["Full Name"],
                "Roll No": student["Roll No"],
                "program Specialization": student["program Specialization"],
                branch: student.branch,
            };
            return data;
        }
        catch (error) {
            console.error("Error generating provisional degree:", error);
            return "Error generating provisional degree";
        }
    });
}
exports.generateProvisionalDegree = generateProvisionalDegree;
function twiceFailCourses(rollNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const student = yield searchByRollNo(rollNumber);
        if (!student) {
            return "Student not found";
        }
        const branch = student["branch"];
        const studentData = yield getStudentData(rollNumber);
        const studentCourseData = yield preprocessCourseData(studentData);
        const failedCourses = new Map();
        for (const course of studentCourseData.courses) {
            if (course.includedInMinors.length >= 6) {
                return `Student has already included ${course.courseCode} in ${course.includedInMinors}.`;
            }
        }
        const mandateCourses = exports.courseDatabase[branch];
        for (const key of Object.keys(exports.courseDatabase)) {
            if (key.startsWith(branch + " bucket")) {
                mandateCourses.push(...exports.courseDatabase[key]);
            }
        }
        for (const mandateCourse of mandateCourses) {
            for (const course of studentCourseData.courses) {
                if (mandateCourse === course.courseCode && course.grade === "F") {
                    if (failedCourses.has(course.courseCode)) {
                        failedCourses.set(course.courseCode, failedCourses.get(course.courseCode) + 1);
                    }
                    else {
                        failedCourses.set(course.courseCode, 1);
                    }
                }
            }
        }
        const failedCoursesTwice = [];
        for (const failedCourse of failedCourses) {
            if (failedCourse[1] < 2) {
                failedCourses.delete(failedCourse[0]);
            }
            for (const course of studentCourseData.courses) {
                if (failedCourse[0] === course.courseCode &&
                    !rule_1.disallowedGrades.includes(course.grade)) {
                    failedCourses.delete(failedCourse[0]);
                }
            }
        }
        if (failedCourses.size === 0) {
            return "No failed courses found";
        }
        for (const failedCourse of failedCourses) {
            failedCoursesTwice.push({
                courseCode: failedCourse[0],
                count: failedCourse[1],
            });
        }
        return failedCoursesTwice;
    });
}
exports.twiceFailCourses = twiceFailCourses;
function substituteCourses(rollNumber, courseCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const student = yield searchByRollNo(rollNumber);
        if (!student) {
            return "Student not found";
        }
        const branch = student["branch"];
        const studentData = yield getStudentData(rollNumber);
        const studentCourseData = yield preprocessCourseData(studentData);
        const substituteCourses = [];
        for (const course of studentCourseData.courses) {
            if (course.courseCode.substring(0, 3) === courseCode.substring(0, 3) &&
                !rule_1.disallowedGrades.includes(course.grade) &&
                Number(course.courseCode.charAt(3)) > 2 &&
                !exports.courseDatabase[branch].includes(course.courseCode)) {
                substituteCourses.push({
                    courseCode: course.courseCode,
                    course: course.course,
                    grade: course.grade,
                });
            }
        }
        if (substituteCourses.length === 0) {
            return "No substitute courses found";
        }
        return substituteCourses;
    });
}
exports.substituteCourses = substituteCourses;
function updateTwiceFail(rollNumber, failCourse, subCourse) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = db_1.db.collection("studentsGrade");
        const query = {
            "Roll No": rollNumber,
            "Course Code": subCourse,
        };
        const update = {
            $set: {
                IncludedInMinors: failCourse,
            },
        };
        try {
            const result = yield collection.updateOne(query, update);
            if (result.modifiedCount === 0) {
                return "Error updating student grade";
            }
            return "Student grade updated successfully";
        }
        catch (error) {
            console.error("Error updating IncludedInMinors:", error);
            throw error;
        }
    });
}
exports.updateTwiceFail = updateTwiceFail;
