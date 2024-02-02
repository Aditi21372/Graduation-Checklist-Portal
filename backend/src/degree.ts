import { allRules } from "./index";
import { StudentInfo } from "./type";

const semesters: string[] = [
  "1",
  "2",
  "Summer Term 1",
  "3",
  "4",
  "Summer Term 2",
  "5",
  "6",
  "Summer Term 3",
  "7",
  "8",
  "Summer Term 4",
  "9",
];

const graduationRules = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export function getGraduationStatus(
  studentCourseData: StudentInfo,
  branch: string
): Boolean {
  let isGraduated: Boolean = true;

  for (let rule of allRules) {
    if (rule.ruleId in graduationRules) {
      if (!rule.checkRule(studentCourseData, branch).isCompleteBool) {
        isGraduated = false;
      }
    }
  }

  return isGraduated;
}

export function getGraduationDate(
  studentCourseData: StudentInfo,
  branch: string
): string {
  const isGraduated = getGraduationStatus(studentCourseData, branch);
  const studentCourses = studentCourseData["courses"];

  let maxSem = 0;
  for (let course of studentCourses) {
    let semester = course["semester"].toString();
    if (semesters.includes(semester)) {
      const semesterIndex = semesters.indexOf(semester); // Add type assertion
      if (semesterIndex > maxSem) {
        maxSem = semesterIndex;
      }
    }
  }
  if (isGraduated) {
    if (maxSem === 10) return "June 21, 2023";
    else if (maxSem === 11) return "September 21, 2023";
    else if (maxSem === 12) return "January 21, 2024";
  }
  return "Not Graduated";
}
