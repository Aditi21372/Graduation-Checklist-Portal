import { StudentInfo } from "./database";
import { disallowedGrades } from "./index";

type Grade = { semester: string; sgpa: number; cgpa: number };

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

export function calculateCGPA(studentInfo: StudentInfo): Grade[] {
  let maxSem = 8;
  let semesters: string[] = [];

  // Iterate over all courses in studentInfo
  for (let course of studentInfo.courses) {
    if (Number(course.semester) > maxSem) maxSem = Number(course.semester);
  }
  for (let i = 1; i <= maxSem; i++) {
    semesters.push(String(i));
    if (i % 2 == 0) {
      let summerSem = "Summer Term " + String(i / 2);
      semesters.push(summerSem);
    }
  }

  return calculateSGPA(studentInfo, semesters);
}

function calculateSGPA(studentInfo: StudentInfo, semesters: string[]): Grade[] {
  let semwiseGpa = [];
  let cumulativeGradeSum = 0;
  let cumulativeCreditSum = 0;
  let cgpa = 0;
  for (let i = 0; i < semesters.length; i++) {
    let creditSum = 0;
    let gradeSum = 0;
    let semesterGpa: Grade = { semester: "", sgpa: 0, cgpa: 0 };
    for (let course of studentInfo.courses) {
      if (String(course.semester) === semesters[i]) {
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
    cumulativeCreditSum += creditSum;
    cumulativeGradeSum += gradeSum;

    let sgpa = 0;
    if (creditSum != 0) {
      sgpa = gradeSum / creditSum;
    }
    cgpa = cumulativeGradeSum / cumulativeCreditSum;

    semesterGpa = {
      semester: semesters[i],
      sgpa: Math.round(sgpa * 100) / 100,
      cgpa: Math.round(cgpa * 100) / 100,
    };
    semwiseGpa.push(semesterGpa);
  }

  return semwiseGpa;
}
