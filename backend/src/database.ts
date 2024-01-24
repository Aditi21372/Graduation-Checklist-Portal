import { db } from "./db";
import {
  StudentCourse,
  CourseMap,
  DatabaseMap,
  StudentInfo,
  GraduatedStudent,
} from "./type";

const xlsx = require("xlsx");

// readExcelColumnWise reads the excel sheet column by column. It constructs a 2-D array where each row represents
// a column of the excel sheet. It also includes the headings along with the data.
export function readExcelColumnWise(filepath: string): any[][] {
  let workbook = xlsx.readFile(filepath);
  // Picks the first sheet from the Excel file.
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  // Index the excel sheet data starting from zero index.
  let range = xlsx.utils.decode_range(worksheet["!ref"]);
  let data = [];

  for (let col = range.s.c; col <= range.e.c; col++) {
    let colData = [];
    for (let row = range.s.r; row <= range.e.r; row++) {
      let cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
      // Checks if the cell exists.
      if (cell) {
        colData.push(cell.v);
      }
    }
    if (colData.every((value) => value === undefined)) {
      continue;
    }
    data.push(colData);
  }
  return data;
}

export function getStudentDatabase(filePath: string): DatabaseMap {
  const studentDatabase: DatabaseMap = {};

  let workbook = xlsx.readFile(filePath);
  // Picks the first sheet from the Excel file.
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  // Index the excel sheet data starting from zero index.
  let range = xlsx.utils.decode_range(worksheet["!ref"]);
  let data = [];

  for (let row = range.s.r; row <= range.e.r; row++) {
    let rowData = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      let cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
      // Checks if the cell exists.
      rowData.push(cell ? cell.v : undefined);
    }
    if (rowData.every((value) => value === undefined)) {
      continue;
    }
    data.push(rowData);
  }

  // Iterate through the data and construct the mapping
  data.forEach((row) => {
    const [
      _sn,
      _rollNo,
      _studentName,
      _program,
      _termCode,
      _courseCode,
      _course,
      _credit,
      _grade,
      _spi,
      _cpi,
    ] = row;

    // Check if the roll number already exists in the mapping
    if (!studentDatabase[_rollNo]) {
      // If it doesn't exist, create a new entry with student information
      const thisStudent: StudentInfo = {
        studentName: _studentName,
        program: _program,
        courses: [],
      };
      studentDatabase[_rollNo] = thisStudent;
    }

    const course: StudentCourse = {
      courseCode: _courseCode,
      grade: _grade,
      semester: _termCode,
      credit: _credit,
    };

    // Add the course information to the courses array
    studentDatabase[_rollNo].courses.push(course);
  });

  // const outputFilePath = './src/data/studentDatabase2.json';
  // const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1, range });
  // const headersRow: Record<string, string> = jsonData[1];
  // const headers: string[] = Object.values(headersRow);
  // console.log(headers);

  // // Rest of the code
  // const mongoDbJson = jsonData.slice(2).map((row: any) => {
  //   const doc: { [key: string]: any } = {};
  //   headers.forEach((header: string, index: number) => {
  //     doc[header] = row[index];
  //   });
  //   return doc;
  // });
  //   // Write JSON data to a file
  //
  // fs.writeFileSync(outputFilePath, JSON.stringify(studentDatabase, null, 2));
  return studentDatabase;
}

export function preprocessCourseData(studentData: any): StudentInfo {
  const studentInfo: StudentInfo = {
    studentName: studentData[0]["Student Name"],
    program: studentData[0]["Program"],
    courses: [],
  };

  studentData.forEach((entry: any) => {
    const course: StudentCourse = {
      courseCode: entry["Course Code"],
      grade: entry["Grade"],
      semester: entry["Batch / Term Code"],
      credit: entry["Credit"],
    };

    studentInfo.courses.push(course);
  });

  return studentInfo;
}

// getCourseDatabase creates a JSON object courseDatabase that stores the course codes for the courses being
// offered to a student.
export function getCourseDatabase(filePath: string): CourseMap {
  const courseDatabase: CourseMap = {};
  let data = readExcelColumnWise(filePath);

  for (const row of data) {
    if (row.length > 0) {
      // Picks the heading from the first element of the row.
      const category = row[0];
      // Creates a list of courses belonging to that category.
      const courses = row.slice(1);
      courseDatabase[category] = courses;
    }
  }
  return courseDatabase;
}

export function getGraduatedStudents(filePath: string): GraduatedStudent[] {
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = xlsx.utils.decode_range(worksheet["!ref"]);
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
    const collection = db.collection("StudentDatabase2019");

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

export async function updateStudentData(studentData: any): Promise<any> {
  try {
    const collection = db.collection("StudentDatabase2019");

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
