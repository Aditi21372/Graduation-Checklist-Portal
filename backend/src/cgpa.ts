import { gradeHierarchy } from "./index";
import { StudentInfo } from "./database";

type Grade = { semester: string; sgpa: number; cgpa: number };
type Course = {
  grade: number;
  credit: number;
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
const disallowedGrades = ["I", "W", "X"];

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

function calculateWorseGradeSum(
  coursesTaken: Map<string, Course>,
  worseCreds: number
): Number {
  let worseGradeSum = 0;

  const creditGroups = new Map<number, number[]>();
  for (const [courseCode, course] of coursesTaken) {
    const { grade, credit } = course;
    if (creditGroups.has(credit)) {
      creditGroups.get(credit)!.push(grade);
    } else {
      creditGroups.set(credit, [grade]);
    }
  }

  creditGroups.forEach((courses, credit) => {
    courses.sort((a, b) => a - b);
  });

  for (const course of coursesTaken.keys()) {
    if (worseCreds <= 0) break;
  }
  return worseGradeSum;
}

function calculateSGPA(studentInfo: StudentInfo, semesters: string[]): Grade[] {
  let semwiseGpa = [];
  let cumulativeGradeSum = 0;
  let cumulativeCreditSum = 0;
  let cgpa = 0;
  let onlineCreds = 0;
  let coursesTaken = new Map<string, Course>();
  for (let i = 0; i < semesters.length; i++) {
    let creditSum = 0;
    let gradeSum = 0;
    let failCredits = 0;
    let semesterGpa: Grade = { semester: "", sgpa: 0, cgpa: 0 };
    for (let course of studentInfo.courses) {
      if (String(course.semester) === semesters[i]) {
        if (disallowedGrades.includes(course.grade)) continue;

        if (coursesTaken.has(course.courseCode)) {
          const prevGrade = coursesTaken.get(course.courseCode)?.grade;
          if (prevGrade && prevGrade < gradeMap[course.grade]) {
            const courseGrade: Course = {
              grade: gradeMap[course.grade],
              credit: course.credit,
            };
            coursesTaken.set(course.courseCode, courseGrade);
            cumulativeGradeSum -= prevGrade * course.credit;
          } else continue;
        } else {
          if (course.grade === "F") {
            gradeSum += 2 * course.credit;
            creditSum += course.credit;
            failCredits += course.credit;
            const courseGrade: Course = {
              grade: gradeMap[course.grade],
              credit: course.credit,
            };
            coursesTaken.set(course.courseCode, courseGrade);
          }
          if (course.grade === "S") {
            if (course.courseCode.startsWith("MSC")) continue;
            else {
              onlineCreds += course.credit;
            }
          }
          continue;
        }
        const courseGrade: Course = {
          grade: gradeMap[course.grade],
          credit: course.credit,
        };
        coursesTaken.set(course.courseCode, courseGrade);
        creditSum += course.credit;
        gradeSum += gradeMap[course.grade] * course.credit;
      }
    }
    cumulativeCreditSum += creditSum - failCredits;
    cumulativeGradeSum += gradeSum - 2 * failCredits;

    if (Number(semesters[i]) == 6 && cumulativeCreditSum + onlineCreds > 116) {
      const worseCreds = Math.min(8, cumulativeCreditSum + onlineCreds - 116);
      const worseGrades = calculateWorseGradeSum(coursesTaken, worseCreds);
    }

    let sgpa = 0;
    if (creditSum !== 0) {
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
