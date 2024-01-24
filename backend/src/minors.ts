import { Console } from "console";
import { courseDatabase } from "./index";
import { StudentInfo, RuleData, CourseData } from "./type";

const disallowedGrades = ["I", "W", "F", "X"];

export function isMinors(studentInfo: StudentInfo): RuleData[] {
  const minors: RuleData[] = [];
  const bioMinors = new ComputationalBiologyMinors();
  minors.push(bioMinors.checkMinorsCompleted(studentInfo));
  const ecoMinors = new EconomicsMinors();
  minors.push(ecoMinors.checkMinorsCompleted(studentInfo));
  return minors;
}

export interface Minors {
  // List the core courses required to be completed for the minors.
  coreCourses: string[];
  // Check if not in same branch
  checkSameBranch: (studentInfo: StudentInfo) => Boolean;
  // Checks if the minimum number of course work credits have been completed.
  checkMandatoryCourses: (studentInfo: StudentInfo) => RuleData;
  // Checks if an additional number of credits have been completed through IP/BTP/coursework/etc.
  checkAdditionalCredits: (studentInfo: StudentInfo, coreData?: CourseData[]) => RuleData;
  // Checks if all the minor requirements have been completed.
  checkMinorsCompleted: (studentInfo: StudentInfo) => RuleData;
}

export class ComputationalBiologyMinors implements Minors {
  coreCourses: string[] = courseDatabase["Minor in BIO"];

  checkSameBranch(studentInfo: StudentInfo): boolean {
    return studentInfo["program"].includes("CSB");
  }

  checkMandatoryCourses(studentInfo: StudentInfo): RuleData {
    const courses = [];
    for (const coreCourse in this.coreCourses) {
      let courseEntry = {
        course: this.coreCourses[coreCourse],
        semester: "",
        status: "Incomplete",
        credits: 0,
        grade: "",
      };
      for (const course of studentInfo["courses"]) {
        if (
          course["courseCode"] === this.coreCourses[coreCourse] &&
          !disallowedGrades.includes(course["grade"])
        ) {
          courseEntry["semester"] = course["semester"];
          courseEntry["status"] = "Complete";
          courseEntry["credits"] = course["credit"];
          courseEntry["grade"] = course["grade"];
        }
      }
      courses.push(courseEntry);
    }
    const ruleData: RuleData = {
      isCompleteBool: courses.length === this.coreCourses.length,
      isCompleteText:
        courses.length === this.coreCourses.length ? "Complete" : "Incomplete",
      data: courses,
    };

    return ruleData;
  }

  checkAdditionalCredits(studentInfo: StudentInfo): RuleData {
    const creditsToComplete = 20 - this.coreCourses.length * 4;
    let creditsCompleted = 0;
    const studentCourses = studentInfo["courses"];
    const courses = [];

    for (const studentCourse of studentCourses) {
      const grade = studentCourse["grade"];

      if (studentCourse["courseCode"].startsWith("BIO") &&
        studentCourse["courseCode"].slice(0, 4) >= "BIO3" &&
        !disallowedGrades.includes(grade)
      ) {
        creditsCompleted += studentCourse["credit"];
        courses.push({
          course: studentCourse["courseCode"],
          semester: studentCourse["semester"],
          status: "Complete",
          credits: studentCourse["credit"],
          grade: studentCourse["grade"],
        });
      }
    }

    const ruleData: RuleData = {
      isCompleteBool: creditsCompleted >= creditsToComplete,
      isCompleteText:
        creditsCompleted >= creditsToComplete ? "Complete" : "Incomplete",
      data: courses,
    };
    return ruleData;
  }

  checkMinorsCompleted(studentInfo: StudentInfo): RuleData {
    const pursuingCSB = this.checkSameBranch(studentInfo);
    const coreCoursesCompleted = this.checkMandatoryCourses(studentInfo);
    const additionalCreditsCompleted = this.checkAdditionalCredits(studentInfo);
    const minors =
      !pursuingCSB &&
      coreCoursesCompleted.isCompleteBool &&
      additionalCreditsCompleted.isCompleteBool;
    const ruleData: RuleData = {
      isCompleteBool: minors,
      isCompleteText: minors ? "Complete" : "Incomplete",
      data: {
        stream: "Computational Biology",
        coreCoursesCompleted: coreCoursesCompleted,
        additionalCreditsCompleted: additionalCreditsCompleted,
      },
    };
    return ruleData;
  }
}

export class EconomicsMinors implements Minors {
  coreCourses: string[] = courseDatabase["Minor in ECO"];

  checkSameBranch(studentInfo: StudentInfo): boolean {
    return studentInfo["program"].includes("CSSS");
  }

  checkMandatoryCourses(studentInfo: StudentInfo): RuleData {

    const courses = [];

    for (const coreCourse in this.coreCourses) {
      let courseEntry = {
        course: this.coreCourses[coreCourse],
        semester: "",
        status: "Incomplete",
        credits: 0,
        grade: "",
      };
      for (const course of studentInfo["courses"]) {
        if (
          course["courseCode"] === this.coreCourses[coreCourse] &&
          !disallowedGrades.includes(course["grade"])
        ) {
          courseEntry["semester"] = course["semester"];
          courseEntry["status"] = "Complete";
          courseEntry["credits"] = course["credit"];
          courseEntry["grade"] = course["grade"];
        }
      }
      courses.push(courseEntry);
    }
    const ruleData: RuleData = {
      isCompleteBool: courses.length >= this.coreCourses.length - 1,
      isCompleteText:
        courses.length >= this.coreCourses.length - 1 ? "Complete" : "Incomplete",
      data: courses,
    };

    return ruleData;
  }

  checkAdditionalCredits(studentInfo: StudentInfo, coreData?: CourseData[]): RuleData {
    const doneMandatory = [];
    let doneMandatoryCredits = 0;
    if (coreData) {
      for (const coreCourse of coreData){
        doneMandatory.push(coreCourse.course);
        doneMandatoryCredits += coreCourse.credits;
      }
    }
    const creditsToComplete = 20 - doneMandatoryCredits;
    let creditsCompleted = 0;
    const studentCourses = studentInfo["courses"];
    const courses = [];

    for (const studentCourse of studentCourses) {
      const grade = studentCourse["grade"];

      if (studentCourse["courseCode"].startsWith("ECO") &&
        !disallowedGrades.includes(grade) && !doneMandatory.includes(studentCourse["courseCode"])
      ) {
        creditsCompleted += studentCourse["credit"];
        courses.push({
          course: studentCourse["courseCode"],
          semester: studentCourse["semester"],
          status: "Complete",
          credits: studentCourse["credit"],
          grade: studentCourse["grade"],
        });
      }
    }

    const ruleData: RuleData = {
      isCompleteBool: creditsCompleted >= creditsToComplete,
      isCompleteText:
        creditsCompleted >= creditsToComplete ? "Complete" : "Incomplete",
      data: courses,
    };
    return ruleData;
  }

  checkMinorsCompleted(studentInfo: StudentInfo): RuleData {
    const pursuingCSSS = this.checkSameBranch(studentInfo);
    const coreCoursesCompleted = this.checkMandatoryCourses(studentInfo);
    const additionalCreditsCompleted = this.checkAdditionalCredits(studentInfo, coreCoursesCompleted.data);
    const minors =
      !pursuingCSSS &&
      coreCoursesCompleted.isCompleteBool &&
      additionalCreditsCompleted.isCompleteBool;
    const ruleData: RuleData = {
      isCompleteBool: minors,
      isCompleteText: minors ? "Complete" : "Incomplete",
      data: {
        stream: "Economics",
        coreCoursesCompleted: coreCoursesCompleted,
        additionalCreditsCompleted: additionalCreditsCompleted,
      },
    };
    return ruleData;
  }
}