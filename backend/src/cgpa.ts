import { StudentInfo } from "./database";
import { courseDatabase, disallowedGrades } from "./index";

type Grade = {
  cgpa: number;
  sgpa: number[];
};

type GradeMap = { [grade: string]: number };

const gradeMap: GradeMap = {
  "A+": 10,
  A: 10,
  "A-": 9,
  B: 8,
  "B-": 7,
  C: 6,
  "C-": 5,
  D: 4,
  F: 2,
};

export function calculateCGPA(
  rollNumber: number,
  studentInfo: StudentInfo
): Grade {
  let grade: Grade = { cgpa: 0, sgpa: [] };
  let creditSum = 0;
  let gradeSum = 0;
  let maxSem = 8;

  // Iterate over all courses in studentInfo
  for (let course of studentInfo.courses) {
    if (disallowedGrades.includes(course.grade)) continue;
    // Calculate the grade points for the course
    let gradePoint = gradeMap[course.grade];
    creditSum += course.credit;
    // Update the CGPA
    gradeSum += gradePoint * course.credit;

    if (Number(course.semester) > maxSem) maxSem = Number(course.semester);
  }

  grade.cgpa = gradeSum / creditSum;
  grade.sgpa = calculateSGPA(rollNumber, studentInfo, maxSem);

  return grade;
}

function calculateSGPA(
  rollNumber: number,
  studentInfo: StudentInfo,
  maxSem: number
): number[] {
  let sgpa: number[] = [];

  for (let i = 1; i <= maxSem; i++) {
    let creditSum = 0;
    let gradeSum = 0;
    for (let course of studentInfo.courses) {
      if (Number(course.semester) === i) {
        if (course.grade === "F") {
          gradeSum += 2 * course.credit;
          creditSum += course.credit;
        }
        if (disallowedGrades.includes(course.grade)) continue;

        // Calculate the grade points for the course
        let gradePoint = gradeMap[course.grade];
        creditSum += course.credit;
        // Update the CGPA
        gradeSum += gradePoint * course.credit;
      }
    }
    sgpa.push(gradeSum / creditSum);
  }

  return sgpa;
}
