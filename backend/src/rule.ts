import { StudentInfo } from "./database";
import {
  gradeHierarchy,
  disallowedGrades,
  studentDatabase,
  courseDatabase,
} from "./index";

export interface RuleData {
  isComplete: Boolean;
  data: any;
}
export interface IRule {
  ruleId: number;
  checkRule: (rollNumber: number, context: any) => RuleData;
}

export const sshRule: IRule = {
  ruleId: 0,
  checkRule: (rollNumber: number, context: any): RuleData => {
    const sshCourses = courseDatabase["SSH Courses"];
    const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
    const studentCourses = studentInfo["courses"];
    let coursesTaken = new Map<string, number>();
    let credits = 0;
    let returnData: RuleData = {
      isComplete: false,
      data: {
        courses: [],
        totalCredits: 0,
      },
    };

    for (const course of studentCourses) {
      for (const courseCode of sshCourses) {
        if (
          course["courseCode"] === courseCode &&
          !disallowedGrades.includes(course["grade"]) &&
          !coursesTaken.has(course["courseCode"])
        ) {
          let courseEntry = {
            course: courseCode,
            semester: course["semester"],
            status: "Complete",
            credits: course["credit"],
            grade: course["grade"],
          };
          returnData.data.courses.push(courseEntry);
          coursesTaken.set(course["courseCode"], 1);
          credits += course["credit"];
        }
      }
    }
    if (credits >= 12) {
      returnData.isComplete = true;
    }
    returnData.data.totalCredits = credits;
    return returnData;
  },
};

export const cwRule: IRule = {
  ruleId: 1,
  checkRule: (rollNumber: number, context: any): RuleData => {
    const cwCourses = courseDatabase["CW Course"];
    const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
    const studentCourses = studentInfo["courses"];
    let credits = 0;
    let returnData: RuleData = {
      isComplete: false,
      data: {
        totalCredits: 0,
        courses: [],
      },
    };

    for (const courseCode of cwCourses) {
      for (const course of studentCourses) {
        if (course["courseCode"] === courseCode && course["grade"] == "S") {
          let courseEntry = {
            course: courseCode,
            semester: course["semester"],
            status: "Complete",
            credits: course["credit"],
            grade: course["grade"],
          };
          credits += course["credit"];
          returnData.data.courses.push(courseEntry);
        }
      }
    }
    if (credits >= 2) {
      returnData.isComplete = true;
    }
    returnData.data.totalCredits = credits;
    return returnData;
  },
};

export const sgRule: IRule = {
  ruleId: 2,
  checkRule: (rollNumber: number, context: any): RuleData => {
    const sgCourses = courseDatabase["SG Course"];
    const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
    const studentCourses = studentInfo["courses"];
    let coursesTaken = new Map<string, number>();
    let credits = 0;
    let returnData: RuleData = {
      isComplete: false,
      data: {
        courses: [],
        totalCredits : 0
      },
    };

    for (const courseCode of sgCourses) {
      for (const course of studentCourses) {
        if (course["courseCode"] === courseCode && course["grade"] == "S") {
          let courseEntry = {
            course: courseCode,
            semester: course["semester"],
            status: "Complete",
            credits: course["credit"],
            grade: course["grade"],
          };
          credits += course["credit"];
          returnData.data.courses.push(courseEntry);
        }
      }
    }
    if (credits >= 2) {
      returnData.isComplete = true;
    }
    returnData.data.totalCredits = credits;

    return returnData;
  },
};

export const btpRule: IRule = {
  ruleId: 3,
  checkRule: (rollNumber: number, context: any): RuleData => {
    let returnData: RuleData = {
      isComplete: false,
      data: null,
    };
    const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
    const studentCourses = studentInfo["courses"];
    let sem = [];
    let credits = 0;

    for (const course of studentCourses) {
      const courseCodebtp = course["courseCode"].substring(0, 3);
      if (
        courseCodebtp === "BTP" &&
        !disallowedGrades.includes(course["grade"])
      ) {
        credits += course["credit"];
        sem.push(course["semester"]);
      }
    }

    if (credits >= 8 && credits <= 12) {
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
      for (const pairDiff of pairDifferences) {
        if (pairDiff == 1) {
          returnData.isComplete = true;
        }
      }
    } else if (credits == 0) {
      returnData.isComplete = true;
    } else {
      returnData.isComplete = false;
    }
    returnData.data = credits;

    return returnData;
  },
};

export const mandatoryCoreRule: IRule = {
  ruleId: 4,
  checkRule: (rollNumber: number, context: any): RuleData => {
    let returnData: RuleData = {
      isComplete: false,
      data: {
        coreCourses: [],
        totalCredits: 0,
      },
    };

    let studentCoreCourse = [];

    if (context === "CSE") {
      // Path to the excel sheet containing courses and their course codes

      const coreCourses = courseDatabase["CSE Core Courses "];
      const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
      const studentCourses = studentInfo["courses"];

      for (const courseCode of coreCourses) {
        let courseEntry = {
          course: courseCode,
          status: "Incomplete",
          credits: 0,
          grade: "",
        };

        for (const studentCourse of studentCourses) {
          if (studentCourse["courseCode"] === courseCode) {
            if (!disallowedGrades.includes(studentCourse["grade"])) {
              courseEntry.status = "Complete";
              courseEntry.credits = studentCourse["credit"];
              const currentGradeIndex = gradeHierarchy.indexOf(
                courseEntry.grade
              );
              const gradeIndex = gradeHierarchy.indexOf(studentCourse["grade"]);
              if (gradeIndex < currentGradeIndex) {
                courseEntry.grade = studentCourse["grade"];
              }
            } else {
              if (courseEntry.status == "Complete") continue;
              courseEntry.status = "Failed";
              courseEntry.credits = 0;
              courseEntry.grade = "F";
            }
          }
        }
        studentCoreCourse.push(courseEntry);
      }
    }

    returnData.isComplete = true;
    for (let i = 0; i < studentCoreCourse.length; i++) {
      if (studentCoreCourse[i].status !== "Complete") {
        returnData.isComplete = false;
      } else {
        returnData.data.totalCredits += studentCoreCourse[i].credits;
      }
    }
    returnData.data.coreCourses = studentCoreCourse;

    return returnData;
  },
};

export const mandatoryBucketRule: IRule = {
  ruleId: 5,
  checkRule: (rollNumber: number, context: any): RuleData => {
    let returnData: RuleData = {
      isComplete: false,
      data: {
        studentBucketCourses: [],
        completedBuckets: [],
      },
    };

    let studentBucketCourse = [];

    if (context === "CSE") {
      // Path to the excel sheet containing courses and their course codes
      const mandatoryBuckets = [];
      const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
      const studentCourses = studentInfo["courses"];

      for (const key of Object.keys(courseDatabase)) {
        if (key.startsWith("Mandatory")) {
          mandatoryBuckets.push(courseDatabase[key]);
        }
      }

      for (const courseBucket of mandatoryBuckets) {
        let mandateBucket = [];
        for (const courseCode of courseBucket) {
          let courseEntry = {
            course: courseCode,
            status: "Incomplete",
            credits: 0,
            grade: "",
          };

          for (const studentCourse of studentCourses) {
            if (studentCourse["courseCode"] === courseCode) {
              if (!disallowedGrades.includes(studentCourse["grade"])) {
                courseEntry.status = "Complete";
                courseEntry.credits = studentCourse["credit"];
                const currentGradeIndex = gradeHierarchy.indexOf(
                  courseEntry.grade
                );
                const gradeIndex = gradeHierarchy.indexOf(
                  studentCourse["grade"]
                );
                if (gradeIndex < currentGradeIndex) {
                  courseEntry.grade = studentCourse["grade"];
                }
              } else {
                if (courseEntry.status == "Complete") continue;
                courseEntry.status = "Failed";
                courseEntry.credits = 0;
                courseEntry.grade = "F";
              }
            }
          }
          mandateBucket.push(courseEntry);
        }
        studentBucketCourse.push(mandateBucket);
      }
    }

    let completedBuckets = [true, true, true, true, true];

    returnData.isComplete = true;
    for (let i = 0; i < studentBucketCourse.length; i++) {
      let atleastOne = false;

      for (let j = 0; j < studentBucketCourse[i].length; j++) {
        if (studentBucketCourse[i][j].status === "Complete") {
          atleastOne = true;
        }
      }
      if (!atleastOne) {
        returnData.isComplete = false;
        completedBuckets[i] = false;
      }
    }

    returnData.data.studentBucketCourses = studentBucketCourse;
    returnData.data.completedBuckets = completedBuckets;

    return returnData;
  },
};

export const twoxxRule: IRule = {
  ruleId: 6,
  checkRule: (rollNumber: number, context: any): RuleData => {
    let returnData: RuleData = {
      isComplete: false,
      data: null,
    };

    const coreCourses = courseDatabase["CSE Core Courses "];
    const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
    const studentCourses = studentInfo["courses"];
    let courses = 0;
    let credits = 0;

    const mandatoryBuckets = [];
    for (const key of Object.keys(courseDatabase)) {
      if (key.startsWith("Mandatory")) {
        mandatoryBuckets.push(courseDatabase[key]);
      }
    }

    const mandatoryBucketCourses = [];
    for (const courseBucket of mandatoryBuckets) {
      for (const course of courseBucket) {
        mandatoryBucketCourses.push(course);
      }
    }

    for (const course of studentCourses) {
      if (
        course["courseCode"].substring(3, 4) === "2" &&
        !disallowedGrades.includes(course["grade"]) &&
        (course["semester"] >= "5" || course["semester"] >= "Summer Term 3") &&
        !courseDatabase["SSH Courses"].includes(course["courseCode"]) &&
        !coreCourses.includes(course["courseCode"]) &&
        !mandatoryBucketCourses.includes(course["courseCode"])
      ) {
        courses += 1;
      }
    }

    if (courses <= 2) {
      returnData.isComplete = true;
    }
    returnData.data = credits;

    return returnData;
  },
};

export const required156CreditsRule: IRule = {
  ruleId: 7,
  checkRule: (rollNumber: number, context: any): RuleData => {
    let returnData: RuleData = {
      isComplete: false,
      data: null,
    };

    const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
    const studentCourses = studentInfo["courses"];
    let disallowedGradesTemp = ["I", "W", "F", "X"];
    let credits = 0;
    let coursesTaken = new Map<string, number>();

    for (const course of studentCourses) {
      if (
        !disallowedGradesTemp.includes(course["grade"]) &&
        !coursesTaken.has(course["courseCode"])
      ) {
        credits += course["credit"];
        coursesTaken.set(course["courseCode"], course["credit"]);
      }
    }
    if (credits >= 156) {
      returnData.isComplete = true;
    }
    returnData.data = credits;

    return returnData;
  },
};

export const ipRule: IRule = {
  ruleId: 8,
  checkRule: (rollNumber: number, context: any): RuleData => {
    let returnData: RuleData = {
      isComplete: false,
      data: null,
    };

    const ipCourses = courseDatabase["IP/IS/UR"];
    const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
    const studentCourses = studentInfo["courses"];
    let credits = 0;

    for (const course of studentCourses) {
      const courseCodeIp = course["courseCode"].substring(0, 3);
      for (const courseCode of ipCourses) {
        if (
          courseCodeIp === courseCode &&
          !disallowedGrades.includes(course["grade"])
        ) {
          credits += course["credit"];
        }
      }
    }

    if (credits <= 8) {
      returnData.isComplete = true;
    } else {
      returnData.isComplete = false;
    }
    returnData.data = credits;

    return returnData;
  },
};

export const onlineCoursesRule: IRule = {
  ruleId: 9,
  checkRule: (rollNumber: number, context: any): RuleData => {
    let returnData: RuleData = {
      isComplete: false,
      data: null,
    };

    const onlineCourses = courseDatabase["Online course"];
    const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
    const studentCourses = studentInfo["courses"];
    let credits = 0;

    for (const course of studentCourses) {
      for (const courseCode of onlineCourses) {
        if (course["courseCode"] === courseCode && course["grade"] == "S") {
          credits += course["credit"];
        }
      }
    }

    if (credits <= 8) {
      returnData.isComplete = true;
    } else {
      returnData.isComplete = false;
    }
    returnData.data = credits;

    return returnData;
  },
};

export const thirtyTwoCreditsRule: IRule = {
  ruleId: 10,
  checkRule: (rollNumber: number, context: any): RuleData => {
    let returnData: RuleData = {
      isComplete: false,
      data: null,
    };

    const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
    const studentCourses = studentInfo["courses"];
    let credits = 0;
    let coursesTaken = new Map<string, number>();

    for (const course of studentCourses) {
      // Doesn't check for a 2xx course.
      // Doesn't check for courses that were Incomplete in the last four semesters.
      if (course["courseCode"].startsWith("CSE2") || course["semester"] < "5") {
        continue;
      }
      // Checks if the course has a valid grade against it and is a CSE course.
      if (
        !disallowedGrades.includes(course["grade"]) &&
        !coursesTaken.has(course["courseCode"]) &&
        course["courseCode"].startsWith("CSE")
      ) {
        credits += course["credit"];
        coursesTaken.set(course["courseCode"], course["credit"]);
      }
    }

    if (credits >= 32) {
      returnData.isComplete = true;
    }
    returnData.data = credits;

    return returnData;
  },
};
