import { StudentInfo, CourseMap, getCourseDatabase } from "./database";

// Path to the excel sheet containing courses and their course codes.
const courseListFilePath = "data/Course_Codes.xlsm";
const courseDatabase: CourseMap = getCourseDatabase(courseListFilePath);
const disallowedGrades = ['I', 'S', 'W', 'F', 'X'];

export interface IRule {
  ruleId: number;
  checkRule: (rollNumber: number, studentInfo: StudentInfo) => Boolean;
}

export class SSHRule implements IRule {
  ruleId: number = 0;

  checkRule(rollNumber: number, studentInfo: StudentInfo): Boolean {
    const sshCourses = courseDatabase['SSH Courses'];
    const studentCourses = studentInfo['courses'];
    let coursesTaken = new Map<string, number>();
    let credits = 0;

    for (const course of studentCourses) {
      for (const courseCode of sshCourses) {
        if (course['courseCode'] === courseCode && !disallowedGrades.includes(course['grade']) && !(coursesTaken.has(course['courseCode']))) {
          coursesTaken.set(course['courseCode'], 1);
          credits += course['credit'];
        }
      }
    }
    if (credits >= 12){
      return true;
    }
    return false;
  }
}

export class CWRule implements IRule {
  ruleId: number = 1;

  checkRule(rollNumber: number, studentInfo: StudentInfo): Boolean {
    const cwCourses = courseDatabase['CW Course'];
    const studentCourses = studentInfo['courses'];
    let credits = 0;

    for (const courseCode of cwCourses) {
      for (const course of studentCourses) {
        if (course['courseCode'] === courseCode && course['grade'] == 'S') {
          credits += course['credit'];
        }
      }
    }
    if (credits == 2){
      return true;
    }
    return false;
  }
}

export class SGRule implements IRule {
  ruleId: number = 1;

  checkRule(rollNumber: number, studentInfo: StudentInfo): Boolean {
    const sgCourses = courseDatabase['SG Course'];
    const studentCourses = studentInfo['courses'];
    let credits = 0;

    for (const courseCode of sgCourses) {
      for (const course of studentCourses) {
        if (course['courseCode'] === courseCode && course['grade'] == 'S') {
          credits += course['credit'];
        }
      }
    }
    if (credits == 2){
      return true;
    }
    return false;
  }
}

