import { DatabaseMap, getStudentDatabase, StudentInfo, CourseMap, getCourseDatabase } from "./database";
import { CSEDegree } from "./degree";
import { SSHRule } from "./rule";

// Path to the excel sheet containing student records.
const studentRecordsFilePath = "data/Student_Database_2019.xlsm";
// Path to the excel sheet containing courses and their course codes.
const courseListFilePath = "data/Course_Codes.xlsm";
const rollNumber = 2018232;
const studentDatabase: DatabaseMap = getStudentDatabase(studentRecordsFilePath);
const courseDatabase: CourseMap = getCourseDatabase(courseListFilePath)

function checkGraduation(rollNumber: number): Boolean {
  // Simple example for 1 rule in CSE
  const student: StudentInfo = studentDatabase[rollNumber];
  const degree: CSEDegree = new CSEDegree();
  const sshRule: SSHRule = new SSHRule();

  degree.addRule(sshRule);

  let isPassed: Boolean = true;
  for (let rule of degree.graduationRules) {
    if (!rule.checkRule(rollNumber, student)) {
      isPassed = false;
    }
  }

  if (isPassed) {
    console.log("Student Passed");
    return true;
  } else {
    console.log("Student Failed");
    return false;
  }
}

checkGraduation(rollNumber);
