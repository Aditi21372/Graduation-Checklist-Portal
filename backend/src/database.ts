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
} from "./rule";
import { calculateCGPA } from "./cgpa";
import { isHonors } from "./honors";
import { isMinors } from "./minors";

export let courseDatabase: CourseMap = {};

export function preprocessCourseData(studentData: any): StudentInfo {
  const studentInfo: StudentInfo = {
    studentName: studentData[0]["Student Name"],
    rollNumber: studentData[0]["Roll No"],
    program: studentData[0]["Program"],
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

  fs.writeFileSync(
    "src/data/student.json",
    JSON.stringify(studentInfo, null, 2)
  );
  
  courseDatabase = getCourseDatabase(studentData[0]["Batch"].toString())

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
  fs.writeFileSync(
    "src/data/course.json",
    JSON.stringify(courseDatabase, null, 2)
  );
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
      ecoMajor: worksheet[`K${row + 1}`]?.v,
      btp: worksheet[`L${row + 1}`]?.v,
      credits: worksheet[`M${row + 1}`]?.v,
      cgpa: worksheet[`N${row + 1}`]?.v,
    };

    graduatedStudents.push(student);
  }

  return graduatedStudents;
}

export async function searchByRollNo(rollNo: number): Promise<any[]> {
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

  const updatedData = data.map((entry) => ({
    ...entry,
    Password: "",
  }));

  try {
    const collection = db.collection("studentsInfo");
    await collection.createIndex({ "Roll No": 1 }, { unique: true });
    const result = await collection.insertMany(updatedData);

    return result.acknowledged;
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
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
      const studentData = await searchByRollNo(Number(student["Roll No"]));
      if (studentData.length === 0) {
        continue;
      }
      const studentCourseData = preprocessCourseData(studentData);
      const branch = studentCourseData["program"].slice(
        studentCourseData["program"].lastIndexOf("/") + 1,
        studentCourseData["program"].length
      );
      if (!getGraduationStatus(studentCourseData, branch)) {
        continue;
      }
      console.log(studentCourseData);
      const summary = await calculateSummary(studentCourseData, branch);
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
    "Graduation Date": gradDate,
    "Total Credits": credits.data,
    CGPA: gpa["10"].cgpa,
    BTP: btp.isCompleteText === "Complete" ? "Yes" : "No",
    Honors: honors.isCompleteText === "Done" ? "Yes" : "No",
    "ECO Minors": "No",
    "CB Minors": "No",
    "ENT Minors": "No",
    "ECO Major":
      majorCore.isCompleteBool && majorElective.isCompleteBool ? "Yes" : "No",
  };

  console.log(majorCore.isCompleteBool && majorElective.isCompleteBool )
  for (let i = 0; i < minors.length; i++) {
    if (minors[i].isCompleteText === "Complete") {
      if (minors[i].data.stream === "Economics") {
        summary["ECO Minors"] = "Yes";
      } else if (minors[i].data.stream === "Computational Biology") {
        summary["CB Minors"] = "Yes";
      } else if (minors[i].data.stream === "Entrepreneurship") {
        summary["ENT Minors"] = "Yes";
      }
    }
  }

  try {
    const graduationSummaryCollection = db.collection("graduationSummary");
    const existingDocument = await graduationSummaryCollection.findOne({ "Roll No": studentCourseData.rollNumber });

    if (existingDocument) {
      // If document with same Roll No exists, update it
      await graduationSummaryCollection.updateOne({ "_id": existingDocument._id }, { $set: summary });
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
