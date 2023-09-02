const xlsx = require('xlsx')
const filePath = "../data/Student_Database_2019.xlsm";

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
    if (rowData.every(value => value === undefined)) {
        continue;
    }
    data.push(rowData);
}

const rollNumberMapping = {};
  
// Iterate through the data and construct the mapping
data.forEach((row) => {
    const [sn, rollNo, studentName, program, termCode, courseCode, course, credit, grade, spi, cpi] = row;
  
    // Check if the roll number already exists in the mapping
    if (!rollNumberMapping[rollNo]) {
      // If it doesn't exist, create a new entry with student information
      rollNumberMapping[rollNo] = {
        studentName,
        program,
        courses: [],
      };
    }
  
    // Add the course information to the courses array
    rollNumberMapping[rollNo].courses.push({
      courseCode,
      grade,
      termCode,
      credit,
    });
  });

console.log(rollNumberMapping[2018232]);