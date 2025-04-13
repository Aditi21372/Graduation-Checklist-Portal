import * as xlsx from "xlsx";
import * as fs from "fs";
import { db } from "./db";

import {
  StudentCourse,
  CourseMap,
  StudentInfo,
  GraduatedStudent,
} from "./type";
import { getGraduationStatus, getGraduationDate } from "./degree";

const xlx = require("xlsx");
import {
  required156CreditsRule,
  btpRule,
  ecoMajorCore,
  ecoMajorElective,
  disallowedGrades,
} from "./rule";
import { calculateCGPA } from "./cgpa";
import { isHonors } from "./honors";
import { isMinors } from "./minors";

export let courseDatabase: CourseMap = {};

export async function preprocessCourseData(
  studentData: any
): Promise<StudentInfo> {
  const student = await searchByRollNo(studentData[0]["Roll No"]);
  const studentInfo: StudentInfo = {
    studentName: student["Name"],
    rollNumber: studentData[0]["Roll No"],
    program: student["branch"],
    batch: studentData[0]["Batch"],
    courses: [],
  };

  studentData.forEach((entry: any) => {
    const course: StudentCourse = {
      courseCode: entry["Course Code"],
      course: entry["Course"],
      grade: entry["Grade"],
      semester: entry["Batch / Term Code"],
      credit: entry["Credit"],
      includedInMinors: entry["IncludedInMinors"],
    };

    studentInfo.courses.push(course);
  });

  courseDatabase = getCourseDatabase(studentData[0]["Batch"].toString());
  return studentInfo;
}

export function getCourseDatabase(batch: string): CourseMap {
  const filePath = `src/data/${batch}.json`;

  const courseDatabase: CourseMap = {};
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

export function getGraduatedStudents(filePath: string): GraduatedStudent[] {
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = xlx.utils.decode_range(worksheet["!ref"]);
  const graduatedStudents: GraduatedStudent[] = [];

  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    const student: GraduatedStudent = {
      sNo: worksheet[`A${row + 1}`]?.v,
      programSeq: worksheet[`B${row + 1}`]?.v,
      rollNo: worksheet[`C${row + 1}`]?.v,
      name: worksheet[`D${row + 1}`]?.v,
      program: worksheet[`E${row + 1}`]?.v,
      graduationDate: worksheet[`F${row + 1}`]?.v,
      honors: worksheet[`G${row + 1}`]?.v,
      minorInCB: worksheet[`H${row + 1}`]?.v,
      minorInEco: worksheet[`I${row + 1}`]?.v,
      minorInENT: worksheet[`J${row + 1}`]?.v,
      minorInQuantum: worksheet[`K${row + 1}`]?.v,
      minorInDesign: worksheet[`K${row + 1}`]?.v,
      ecoMajor: worksheet[`L${row + 1}`]?.v,
      btp: worksheet[`M${row + 1}`]?.v,
      credits: worksheet[`N${row + 1}`]?.v,
      cgpa: worksheet[`O${row + 1}`]?.v,
    };

    graduatedStudents.push(student);
  }

  return graduatedStudents;
}

export async function searchByRollNo(rollNo: number): Promise<any> {
  try {
    const collection = db.collection("studentsInfo");
    const query = { "Roll No": rollNo };
    const result = await collection.findOne(query);
    if (result === null || result.aknowledged === 0) {
      return null;
    }

    const studentInfo = {
      "Roll No": result["Roll No"],
      Name: result["Full Name"],
      branch: result["branch"],
    };

    return studentInfo;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getStudentData(rollNo: number): Promise<any[]> {
  try {
    const collection = db.collection("studentsGrade");

    // Use the find method to retrieve all documents matching the query
    const query = { "Roll No": rollNo };
    const result = await collection.find(query).toArray();
    if (result.length === 0) {
      return []; // Return an empty array
    }

    return result;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function updateStudentGrade(studentData: any): Promise<any> {
  try {
    const collection = db.collection("studentsGrade");

    // Use the find method to retrieve all documents matching the query
    const query = {
      "Roll No": studentData["Roll No"],
      "Batch / Term Code": studentData["Batch / Term Code"],
      "Course Code": studentData["Course Code"],
      "Grade": { $ne: studentData["Grade"] } 
    };

    const existingStudent = await collection.findOne(query);
    if (!existingStudent) {
      return []; // Student not found
    }

    existingStudent["Grade"] = studentData["Grade"];
    const result = await collection.replaceOne(query, existingStudent);
    if (result.modifiedCount === 0) {
      return []; // Document not updated
    }
    return existingStudent; // Document updated successfully
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function updateStudentDatabase(fileBuffer: Buffer): Promise<any> {
  const workbook: xlsx.WorkBook = xlsx.read(fileBuffer, { type: "buffer" });
  const sheetName: string = workbook.SheetNames[0];
  const sheet: xlsx.WorkSheet = workbook.Sheets[sheetName];
  const data: any[] = xlsx.utils.sheet_to_json(sheet);

  const updatedData = data.map((entry) => ({
    ...entry,
    Batch: parseInt(entry["Batch"]),
    "Roll No": parseInt(entry["Roll No"]),
    Credit: parseInt(entry["Credit"]),
    "Batch / Term Code": formatTermCode(entry["Batch / Term Code"]),
    IncludedInMinors: "No",
  }));

  try {
    const collection = db.collection("studentsGrade");
    const result = await collection.insertMany(updatedData);

    return result.acknowledged;
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
    throw error;
  }
}

export function updateCourseDatabase(
  fileBuffer: Buffer,
  fileName: string
): boolean {
  try {
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const range = xlx.utils.decode_range(sheet["!ref"]);

    // Convert Excel sheet to JSON with column headings
    const jsonData: string[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const data: { [key: string]: any[] } = {}; // Add index signature to the data object

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
  } catch (error) {
    console.error("Error processing file:", error);
    return false;
  }
}

function formatTermCode(termCode: string): string {
  if (termCode.toString().includes("Semester")) {
    return termCode.replace("Semester ", "").trim();
  }

  return termCode;
}

export async function updateStudentDetails(fileBuffer: Buffer): Promise<any> {
  const workbook: xlsx.WorkBook = xlsx.read(fileBuffer, { type: "buffer" });
  const sheetName: string = workbook.SheetNames[0];
  const sheet: xlsx.WorkSheet = workbook.Sheets[sheetName];
  const data: any[] = xlsx.utils.sheet_to_json(sheet);

  // Retrieve existing roll numbers from the database
  const existingRollNumbers = await getExistingRollNumbers();

  const updatedData = data
    .filter((entry) => {
      // Filter out entries with roll numbers that already exist in the database
      return !existingRollNumbers.includes(entry["Roll No"]);
    })
    .map((entry) => ({
      ...entry,
      Password: generateRandomPassword(),
      branch: mapProgramToBranch(entry["program Specialization"]),
      prefix: entry["Gender"] == "Male" ? "Mr" : "Ms",
    }));

  if (updatedData.length === 0) {
    return 0; // Or handle this case as needed
  }

  try {
    const collection = db.collection("studentsInfo");
    const result = await collection.insertMany(updatedData);

    if (result.acknowledged) {
      return 1;
    }
    return -1;
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
    return -1;
  }
}

// Function to retrieve existing roll numbers from the database
async function getExistingRollNumbers(): Promise<number[]> {
  try {
    const collection = db.collection("studentsInfo");
    const existingRollNumbers = await collection.distinct("Roll No");

    return existingRollNumbers;
  } catch (error) {
    console.error("Error retrieving existing roll numbers:", error);
    throw error;
  }
}

export async function generateSummary(): Promise<any> {
  try {
    const studentsCollection = db.collection("studentsInfo");

    // Fetch all students' information from studentsInfo collection
    const studentsInfo = await studentsCollection.find({}).toArray();

    // Loop through each student
    for (const student of studentsInfo) {
      // Extract student's information from studentsGrade collection
      const studentData = await getStudentData(Number(student["Roll No"]));
      if (studentData.length === 0) {
        continue;
      }
      const studentCourseData = await preprocessCourseData(studentData);
      if (!studentCourseData) {
        continue;
      }
      

      const branch = studentCourseData["program"];
      // if (!getGraduationStatus(studentCourseData, branch)) {
      //   continue;
      // }
      await calculateSummary(studentCourseData, branch);
    }

    return "Summary generation completed.";
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
}

async function calculateSummary(
  studentCourseData: StudentInfo,
  branch: string
): Promise<any> {
  const credits = required156CreditsRule.checkRule(studentCourseData, null);
  const gradDate = getGraduationDate(studentCourseData, branch);
  const gpa = calculateCGPA(studentCourseData);
  const btp = btpRule.checkRule(studentCourseData, null);
  const honors = isHonors(studentCourseData, branch);
  const minors = isMinors(studentCourseData);
  const majorCore = ecoMajorCore.checkRule(studentCourseData, null);
  const majorElective = ecoMajorElective.checkRule(studentCourseData, null);

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
    "ECO Major":
      majorCore.isCompleteBool && majorElective.isCompleteBool ? "Yes" : "No",
    
  };

  for (let i = 0; i < minors.length; i++) {
    if (minors[i].isCompleteText === "Complete") {
      if (minors[i].data.stream === "Economics") {
        summary["ECO Minors"] = "Yes";
      } else if (minors[i].data.stream === "Computational Biology") {
        summary["CB Minors"] = "Yes";
      } else if (minors[i].data.stream === "Entrepreneurship") {
        summary["ENT Minors"] = "Yes";
        } else if (minors[i].data.stream === "Quantum") {
        summary["Quantum Minors"] = "Yes";} 
      else if (minors[i].data.stream === "Design") {
        summary["Design Minors"] = "Yes";
      }
    }
  }

  try {
    const graduationSummaryCollection = db.collection("graduationSummary");
    const existingDocument = await graduationSummaryCollection.findOne({
      "Roll No": studentCourseData.rollNumber,
    });

    if (existingDocument) {
      // If document with same Roll No exists, update it
      await graduationSummaryCollection.updateOne(
        { _id: existingDocument._id },
        { $set: summary }
      );
    } else {
      // If no document with same Roll No exists, insert new document
      await graduationSummaryCollection.insertOne(summary);
    }
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
    throw error;
  }
}

export async function getSummary(batch: Number): Promise<any> {
  try {
    const collection = db.collection("graduationSummary");
    const query = { Batch: batch };
    const result = await collection.find(query).toArray();

    return result;
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    throw error;
  }
}

function generateRandomPassword() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@";
  let password = "";
  const length = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function sendPasswords() {
  const collection = db.collection("studentsInfo");
  const cursor = collection.find({});
  const data = await cursor.toArray();

  const workbook = xlsx.utils.book_new();
  const sheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, sheet, "StudentsInfo");
  const excelBuffer = xlsx.write(workbook, { type: "buffer" });
  return excelBuffer;
}

export async function checkCredentials(
  username: string,
  password: string
): Promise<any> {
  try {
    const collection = db.collection("studentsInfo");
    const query = { "Primary Email Id": username, Password: password };
    const result = await collection.findOne(query);
    if (result !== null) {
      return result["Roll No"];
    }

    return null;
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    throw error;
  }
}

function mapProgramToBranch(program: string): string {
  switch (program) {
    case "Electronics and Communication Engineering":
      return "ECE";
    // case "Electronics and VLSI Engineering":
    //   return "EVE";
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

export async function getBtpData(rollNo: Number): Promise<any> {
  try {
    const collection = db.collection("studentsGrade");
    const query = {
      "Roll No": rollNo,
      "Course Code": /^BTP/,
      Grade: { $nin: ["W", "F", "I"] },
    };
    const result = await collection.find(query).toArray();
    if (result.length === 0) {
      return []; // Return an empty array
    }
    return result;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function includeBTP(btpData: any, rollNo: number) {
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
  const collection = db.collection("studentsGrade");
  try {
    const result = await collection.updateOne(query, update);
    return result;
  } catch (error) {
    console.error("Error updating IncludedInMinors:", error);
    throw error;
  }
}

export async function addToProvisional(rollNo: Number): Promise<any> {
  const collection = db.collection("provisionalRequests");
  const query = { "Roll No": rollNo };
  if (await collection.findOne(query)) {
    return "Request already exists";
  }
  try {
    await collection.insertOne({ "Roll No": rollNo });
    return "Request In Progress";
  } catch (error) {
    console.error("Error adding to provisional requests:", error);
    return "Error adding to provisional requests";
  }
}

export async function getAllProvisional(): Promise<any> {
  const collection = db.collection("provisionalRequests");
  try {
    const result = await collection.find({}).toArray();
    return result;
  } catch (error) {
    console.error("Error fetching provisional requests:", error);
    throw error;
  }
}

export async function generateProvisionalDegree(rollNo: string): Promise<any> {
  const collection = db.collection("studentsInfo");
  const query = { "Roll No": Number(rollNo) };
  try {
    const student = await collection.findOne(query);
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
  } catch (error) {
    console.error("Error generating provisional degree:", error);
    return "Error generating provisional degree";
  }
}

export async function twiceFailCourses(rollNumber: number): Promise<any> {
  const student = await searchByRollNo(rollNumber);
  if (!student) {
    return "Student not found";
  }
  const branch = student["branch"];
  const studentData = await getStudentData(rollNumber);
  const studentCourseData = await preprocessCourseData(studentData);
  const failedCourses = new Map();

  for (const course of studentCourseData.courses) {
    if (course.includedInMinors.length >= 6) {
      return `Student has already included ${course.courseCode} in ${course.includedInMinors}.`;
    }
  }

  const mandateCourses = courseDatabase[branch];
  for (const key of Object.keys(courseDatabase)) {
    if (key.startsWith(branch + " bucket")) {
      mandateCourses.push(...courseDatabase[key]);
    }
  }

  for (const mandateCourse of mandateCourses) {
    for (const course of studentCourseData.courses) {
      if (mandateCourse === course.courseCode && course.grade === "F") {
        if (failedCourses.has(course.courseCode)) {
          failedCourses.set(
            course.courseCode,
            failedCourses.get(course.courseCode) + 1
          );
        } else {
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
      if (
        failedCourse[0] === course.courseCode &&
        !disallowedGrades.includes(course.grade)
      ) {
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
}

export async function substituteCourses(
  rollNumber: number,
  courseCode: string
): Promise<any> {
  const student = await searchByRollNo(rollNumber);
  if (!student) {
    return "Student not found";
  }
  const branch = student["branch"];
  const studentData = await getStudentData(rollNumber);
  const studentCourseData = await preprocessCourseData(studentData);
  const substituteCourses = [];

  for (const course of studentCourseData.courses) {
    if (
      course.courseCode.substring(0, 3) === courseCode.substring(0, 3) &&
      !disallowedGrades.includes(course.grade) &&
      Number(course.courseCode.charAt(3)) > 2 &&
      !courseDatabase[branch].includes(course.courseCode)
    ) {
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
}

export async function updateTwiceFail(
  rollNumber: Number,
  failCourse: string,
  subCourse: string
): Promise<any> {
  const collection = db.collection("studentsGrade");
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
    const result = await collection.updateOne(query, update);
    if (result.modifiedCount === 0) {
      return "Error updating student grade";
    }
    return "Student grade updated successfully";
  } catch (error) {
    console.error("Error updating IncludedInMinors:", error);
    throw error;
  }
}
