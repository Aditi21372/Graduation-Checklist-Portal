import { StudentInfo, CourseMap, getCourseDatabase } from "./database";

// Path to the excel sheet containing courses and their course codes.
const courseListFilePath = "data/Course_Codes.xlsm";
const courseDatabase: CourseMap = getCourseDatabase(courseListFilePath);
let disallowedGrades = ['I', 'S', 'W', 'F', 'X'];

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
  ruleId: number = 2;

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

export class IPRule implements IRule {
  ruleId: number = 3;

  checkRule(rollNumber: number, studentInfo: StudentInfo): Boolean {
    const ipCourses = courseDatabase['IP/IS/UR'];
    const studentCourses = studentInfo['courses'];
    let credits = 0;

    for (const course of studentCourses) {
      const courseCodeIp = course['courseCode'].substring(0, 3);
      for (const courseCode of ipCourses) {
        if (courseCodeIp === courseCode && !disallowedGrades.includes(course['grade'])) {
          credits += course['credit'];
        }
      }
    }
    if (credits <= 8){
      return true;
    }
    return false;
  }
}

export class OnlineCourseRule implements IRule {
  ruleId: number = 4;

  checkRule(rollNumber: number, studentInfo: StudentInfo): Boolean {
    const onlineCourses = courseDatabase['Online course'];
    const studentCourses = studentInfo['courses'];
    let credits = 0;

    for (const course of studentCourses) {
      for (const courseCode of onlineCourses) {
        if (course['courseCode'] === courseCode && course['grade'] == 'S') {
          credits += course['credit'];
        }
      }
    }
    if (credits <= 8){
      return true;
    }
    return false;
  }
}

export class BTPRule implements IRule {
  ruleId: number = 5;

  checkRule(rollNumber: number, studentInfo: StudentInfo): Boolean {
    const studentCourses = studentInfo['courses'];
    let credits = 0;
    let sem = [];

    for (const course of studentCourses) {
      const courseCodebtp = course['courseCode'].substring(0, 3);
      if (courseCodebtp === 'BTP' && !disallowedGrades.includes(course['grade'])) {
        credits += course['credit'];
        sem.push(course['semester']);
      }
    }
    if (credits >= 8 && credits <= 12){
      const pairDifferences = [];
      for (let i = 0; i < sem.length; i++) {
        for (let j = i + 1; j < sem.length; j++) {
          const num1 = parseFloat(sem[i]); // Convert the string to a number
          const num2 = parseFloat(sem[j]); // Convert the string to a number

            if (!isNaN(num1) && !isNaN(num2)) {
                const difference = Math.abs(num1 - num2); // Calculate the absolute difference
                pairDifferences.push(difference);
            }
        }
      }
      for(const pairDiff of pairDifferences){
        if(pairDiff == 1){
          return true;
        }
      }
    }

    else if (credits == 0){
      return true;
    }
    return false;
  }
}

export class MandateRule implements IRule {
  ruleId: number = 6;

  checkRule(rollNumber: number, studentInfo: StudentInfo): Boolean {
    const coreCourses = courseDatabase['CSE Core Courses '];
    const studentCourses = studentInfo['courses'];
    let courses = 0;

    for (const courseCode of coreCourses) {
      for (const course of studentCourses) {
        if (course['courseCode'] === courseCode && !disallowedGrades.includes(course['grade'])) {
          courses += 1;
        }
      }
    }
    if (courses == coreCourses.length){
      return true;
    }
    return false;
  }
}

export class BucketRule implements IRule {
  ruleId: number = 7;

  checkRule(rollNumber: number, studentInfo: StudentInfo): Boolean {
    const mandatoryBuckets = []
    for (const key of Object.keys(courseDatabase)) {
      if (key.startsWith("Mandatory")) {
        mandatoryBuckets.push(courseDatabase[key]);
      }
    }
    const studentCourses = studentInfo['courses'];
    let courses = 0;

    for (const courseBucket of mandatoryBuckets) {
      let flag = false;
      for (const courseCode of courseBucket){
        for (const course of studentCourses) {
          if(course['courseCode'] === courseCode && !disallowedGrades.includes(course['grade'])){
            flag = true;
            break;
          }
        }
        if(flag == true){
          break;
        }
      }
      if(flag == false){
        return false;
      }
    }
    return true;
  }  
}

export class RequiredCreditRule implements IRule {
  ruleId: number = 8;

  checkRule(rollNumber: number, studentInfo: StudentInfo): Boolean {
    return true;
  }  
}

export class RequiredCseCreditRule implements IRule {
  ruleId: number = 9;

  checkRule(rollNumber: number, studentInfo: StudentInfo): Boolean {
    return true;
  }  
}

export class TwoXCreditRule implements IRule {
  ruleId: number = 10;

  checkRule(rollNumber: number, studentInfo: StudentInfo): Boolean {
    const coreCourses = courseDatabase['CSE Core Courses'];
    const studentCourses = studentInfo['courses'];
    let courses = 0;

    for (const course of studentCourses) {
      if (course['courseCode'].substring(3, 4) === "2" && !disallowedGrades.includes(course['grade']) && (course['semester'] >= '5' || course['semester'] >= 'Summer Term 3') && !courseDatabase['SSH Courses'].includes(course['courseCode'])) {
        courses += 1;
      }
    }
    if (courses <= 4){
      return true;
    }
    return false;
  }  
}


