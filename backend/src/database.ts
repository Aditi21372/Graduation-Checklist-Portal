import { StudentCourse } from "./degree";

const xlsx = require("xlsx");

export type StudentInfo = {
  studentName: string;
  program: string;
  courses: StudentCourse[];
};

export type DatabaseMap = {
  [key: number]: StudentInfo; // Here, specify the types for keys and values
};

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
      semster: _termCode,
      credit: _credit,
    };

    // Add the course information to the courses array
    studentDatabase[_rollNo].courses.push(course);
  });

  return studentDatabase;
}

