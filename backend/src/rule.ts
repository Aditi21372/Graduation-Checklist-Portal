import { StudentInfo, RuleData, CourseData } from "./type";
import { gradeHierarchy, disallowedGrades, courseDatabase } from "./index";

// export type RuleData {
//   isCompleteText: string;
//   isCompleteBool: boolean;
//   data: any;
// }
export interface IRule {
  ruleId: number;
  checkRule: (studentCourseData: StudentInfo, context: any) => RuleData;
}

export const mandatoryCoreRule: IRule = {
  ruleId: 0,
  checkRule: (studentCourseData: StudentInfo, context: any): RuleData => {
    let returnData: RuleData = {
      isCompleteBool: true,
      isCompleteText: "Complete",
      data: {
        coreCourses: [],
        totalCredits: 0,
      },
    };

    let studentCoreCourse = [];

    if (context === "CSE") {
      const coreCourses = courseDatabase["CSE"];

      const studentCourses = studentCourseData["courses"];

      for (const courseCode of coreCourses) {
        let courseEntry: CourseData = {
          course: courseCode,
          courseName: "",
          semester: "",
          status: "Incomplete",
          credits: 0,
          grade: "",
        };

        for (const studentCourse of studentCourses) {
          if (studentCourse["courseCode"] === courseCode) {
            if (!disallowedGrades.includes(studentCourse["grade"])) {
              courseEntry.status = "Complete";
              courseEntry.credits = studentCourse["credit"];
              courseEntry.semester = studentCourse["semester"];
              courseEntry.courseName = studentCourse["course"];
              const currentGradeIndex = gradeHierarchy.indexOf(
                courseEntry.grade
              );
              const gradeIndex = gradeHierarchy.indexOf(studentCourse["grade"]);
              if (gradeIndex < currentGradeIndex) {
                courseEntry.grade = studentCourse["grade"];
              }
            } else {
              if (courseEntry.status == "Complete") continue;
              courseEntry.status =
                studentCourse["grade"] === "F" ? "Failed" : "Incomplete";
              courseEntry.semester = studentCourse["semester"];
              courseEntry.credits = 0;
              courseEntry.grade = studentCourse["grade"];
            }
          }
        }
        studentCoreCourse.push(courseEntry);
      }
    }

    for (let i = 0; i < studentCoreCourse.length; i++) {
      if (studentCoreCourse[i].status !== "Complete") {
        returnData.isCompleteBool = false;
        returnData.isCompleteText = "Incomplete";
      } else {
        returnData.data.totalCredits += studentCoreCourse[i].credits;
      }
    }
    returnData.data.coreCourses = studentCoreCourse;

    return returnData;
  },
};

export const mandatoryBucketRule: IRule = {
  ruleId: 1,
  checkRule: (studentCourseData: StudentInfo, context: any): RuleData => {
    let returnData: RuleData = {
      isCompleteBool: true,
      isCompleteText: "Complete",
      data: {
        studentBucketCourses: [],
        completedBuckets: [],
        totalCredits: 0,
      },
    };

    let studentBucketCourse = [];

    if (context === "CSE") {
      // Path to the excel sheet containing courses and their course codes
      const mandatoryBuckets = [];

      const studentCourses = studentCourseData["courses"];

      for (const key of Object.keys(courseDatabase)) {
        if (key.startsWith("CSE bucket")) {
          mandatoryBuckets.push(courseDatabase[key]);
        }
      }

      for (const courseBucket of mandatoryBuckets) {
        let mandateBucket = [];
        for (const courseCode of courseBucket) {
          let courseEntry: CourseData = {
            course: courseCode,
            courseName: "",
            semester: "",
            status: "Incomplete",
            credits: 0,
            grade: "",
          };

          for (const studentCourse of studentCourses) {
            if (studentCourse["courseCode"] === courseCode) {
              courseEntry.courseName = studentCourse["course"];
              if (!disallowedGrades.includes(studentCourse["grade"])) {
                courseEntry.status = "Complete";
                courseEntry.credits = studentCourse["credit"];
                courseEntry.semester = studentCourse["semester"];
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
                courseEntry.status =
                  studentCourse["grade"] === "F" ? "Failed" : "Incomplete";
                courseEntry.credits = 0;
                courseEntry.grade = studentCourse["grade"];
                courseEntry.semester = studentCourse["semester"];
              }
            }
          }
          console.log(courseEntry);
          mandateBucket.push(courseEntry);
        }
        studentBucketCourse.push(mandateBucket);
      }
    }

    let completedBuckets = [true, true, true, true, true];

    for (let i = 0; i < studentBucketCourse.length; i++) {
      let atleastOne = false;

      for (let j = 0; j < studentBucketCourse[i].length; j++) {
        if (studentBucketCourse[i][j].status === "Complete") {
          returnData.data.totalCredits += studentBucketCourse[i][j].credits;
          atleastOne = true;
        }
      }
      if (!atleastOne) {
        returnData.isCompleteBool = false;
        returnData.isCompleteText = "Incomplete";
        completedBuckets[i] = false;
      }
    }

    returnData.data.studentBucketCourses = studentBucketCourse;
    returnData.data.completedBuckets = completedBuckets;

    return returnData;
  },
};

export const sshRule: IRule = {
  ruleId: 2,
  checkRule: (studentCourseData: StudentInfo, context: any): RuleData => {
    const sshCourses = courseDatabase["SSH Courses"];
    const studentCourses = studentCourseData["courses"];
    let coursesTaken = new Map<string, number>();
    let credits = 0;
    let returnData: RuleData = {
      isCompleteText: "Incomplete",
      isCompleteBool: false,
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
          let courseEntry: CourseData = {
            course: courseCode,
            courseName: course["course"],
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
      returnData.isCompleteBool = true;
      returnData.isCompleteText = "Complete";
    }
    returnData.data.totalCredits = credits;
    return returnData;
  },
};

export const cwRule: IRule = {
  ruleId: 3,
  checkRule: (studentCourseData: StudentInfo, context: any): RuleData => {
    const cwCourses = courseDatabase["CW Course"];
    const studentCourses = studentCourseData["courses"];
    let credits = 0;
    let returnData: RuleData = {
      isCompleteBool: false,
      isCompleteText: "Incomplete",
      data: {
        totalCredits: 0,
        courses: [],
      },
    };

    for (const courseCode of cwCourses) {
      for (const course of studentCourses) {
        if (course["courseCode"] === courseCode && course["grade"] == "S") {
          let courseEntry: CourseData = {
            course: courseCode,
            courseName: course["course"],
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
    if (credits == 2) {
      returnData.isCompleteBool = true;
      returnData.isCompleteText = "Complete";
    } else if (credits > 2) {
      returnData.isCompleteBool = false;
      returnData.isCompleteText = "Done extra credits";
    }
    returnData.data.totalCredits = credits;
    return returnData;
  },
};

export const sgRule: IRule = {
  ruleId: 4,
  checkRule: (studentCourseData: StudentInfo, context: any): RuleData => {
    const sgCourses = courseDatabase["SG Course"];
    const studentCourses = studentCourseData["courses"];
    let coursesTaken = new Map<string, number>();
    let credits = 0;
    let returnData: RuleData = {
      isCompleteText: "Incomplete",
      isCompleteBool: false,
      data: {
        courses: [],
        totalCredits: 0,
      },
    };

    for (const courseCode of sgCourses) {
      for (const course of studentCourses) {
        if (course["courseCode"] === courseCode && course["grade"] == "S") {
          let courseEntry: CourseData = {
            course: courseCode,
            courseName: course["course"],
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
    if (credits == 2) {
      returnData.isCompleteBool = true;
      returnData.isCompleteText = "Complete";
    } else if (credits > 2) {
      returnData.isCompleteBool = false;
      returnData.isCompleteText = "Done extra credits";
    }
    returnData.data.totalCredits = credits;

    return returnData;
  },
};

export const thirtyTwoCreditsRule: IRule = {
  ruleId: 5,
  checkRule: (studentCourseData: StudentInfo, context: any): RuleData => {
    let returnData: RuleData = {
      isCompleteBool: false,
      isCompleteText: "Incomplete",
      data: {
        totalCredits: 0,
        courseData: [],
      },
    };

    const studentCourses = studentCourseData["courses"];
    let credits = 0;
    let coursesTaken = new Map<string, number>();

    for (const course of studentCourses) {
      // Doesn't check for a 2xx course.
      // Doesn't check for courses that were Incomplete in the last four semesters.
      if (
        course["courseCode"].startsWith("CSE2") ||
        course["semester"] < "5" ||
        course["semester"].toString().startsWith("Summer Term")
      ) {
        continue;
      }
      // Checks if the course has a valid grade against it and is a CSE course.
      if (
        !disallowedGrades.includes(course["grade"]) &&
        !coursesTaken.has(course["courseCode"]) &&
        course["courseCode"].startsWith("CSE")
      ) {
        let courseEntry: CourseData = {
          course: course["courseCode"],
          courseName: course["course"],
          semester: course["semester"],
          status: "Complete",
          credits: course["credit"],
          grade: course["grade"],
        };
        credits += course["credit"];
        coursesTaken.set(course["courseCode"], course["credit"]);
        returnData.data.courseData.push(courseEntry);
      }
    }

    let onlineCourseData = onlineCoursesRule.checkRule(
      studentCourseData,
      context
    );
    const branch: string = context ? context : "CSE";
    for (let course of onlineCourseData.data.courses) {
      if (course["course"].startsWith(branch)) {
        let courseEntry: CourseData = {
          course: course["course"],
          courseName: course["course"],
          semester: course["semester"],
          status: "Complete",
          credits: course["credits"],
          grade: course["grade"],
        };
        credits += Number(course["credits"]);
        returnData.data.courseData.push(courseEntry);
      }
    }

    if (credits >= 32) {
      returnData.isCompleteBool = true;
      returnData.isCompleteText = "Complete";
    }
    returnData.data.totalCredits = credits;
    return returnData;
  },
};

export const ipRule: IRule = {
  ruleId: 6,
  checkRule: (studentCourseData: StudentInfo, context: any): RuleData => {
    let returnData: RuleData = {
      isCompleteBool: true,
      isCompleteText: "Not Done",
      data: {
        totalCredits: 0,
        courses: [],
      },
    };

    const ipCourses = courseDatabase["IP/IS/UR"];
    const studentCourses = studentCourseData["courses"];
    let credits = 0;

    for (const course of studentCourses) {
      const courseCodeIp = course["courseCode"].substring(0, 3);
      for (const courseCode of ipCourses) {
        if (
          courseCodeIp === courseCode &&
          !disallowedGrades.includes(course["grade"])
        ) {
          let courseEntry: CourseData = {
            course: course["courseCode"],
            courseName: course["course"],
            semester: course["semester"],
            status: "Complete",
            credits: course["credit"],
            grade: course["grade"],
          };
          returnData.data.courses.push(courseEntry);
          credits += course["credit"];
        }
      }
    }

    if (credits == 0) {
      returnData.isCompleteText = "Not Done";
    }
    if (credits <= 8) {
      returnData.isCompleteText = "Complete";
    } else {
      returnData.isCompleteBool = false;
      returnData.isCompleteText = "Done extra credits";
    }
    returnData.data.totalCredits = credits;

    return returnData;
  },
};

export const onlineCoursesRule: IRule = {
  ruleId: 7,
  checkRule: (studentCourseData: StudentInfo, context: any): RuleData => {
    let returnData: RuleData = {
      isCompleteBool: true,
      isCompleteText: "Not Done",
      data: {
        totalCredits: 0,
        courses: [],
      },
    };

    const onlineCourses = courseDatabase["Online course"];

    const studentCourses = studentCourseData["courses"];
    let credits = 0;

    for (const course of studentCourses) {
      for (const courseCode of onlineCourses) {
        if (course["courseCode"] === courseCode && course["grade"] == "S") {
          let courseEntry: CourseData = {
            course: course["courseCode"],
            courseName: course["course"],
            semester: course["semester"],
            status: "Complete",
            credits: course["credit"],
            grade: course["grade"],
          };
          returnData.data.courses.push(courseEntry);
          credits += course["credit"];
        }
      }
    }

    if (credits == 0) {
      returnData.isCompleteText = "Not Done";
    } else if (credits <= 8) {
      returnData.isCompleteText = "Complete";
    } else {
      returnData.isCompleteBool = false;
      returnData.isCompleteText = "Done extra credits";
    }
    returnData.data.totalCredits = credits;
    return returnData;
  },
};

export const twoxxRule: IRule = {
  ruleId: 8,
  checkRule: (studentCourseData: StudentInfo, context: any): RuleData => {
    let returnData: RuleData = {
      isCompleteBool: true,
      isCompleteText: "Not Done",
      data: {
        totalCredits: 0,
        courses: [],
      },
    };

    const coreCourses = courseDatabase["CSE"];

    const studentCourses = studentCourseData["courses"];
    let credits = 0;

    const mandatoryBuckets = [];
    for (const key of Object.keys(courseDatabase)) {
      if (key.startsWith("CSE bucket")) {
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
        ((course["semester"] >= "5" &&
          !course["semester"].toString().startsWith("Summer")) ||
          course["semester"] >= "Summer Term 3") &&
        !courseDatabase["SSH Courses"].includes(course["courseCode"]) &&
        !coreCourses.includes(course["courseCode"]) &&
        !mandatoryBucketCourses.includes(course["courseCode"])
      ) {
        let courseEntry: CourseData = {
          course: course["courseCode"],
          courseName: course["course"],
          semester: course["semester"],
          status: "Complete",
          credits: course["credit"],
          grade: course["grade"],
        };
        returnData.data.courses.push(courseEntry);
        credits += course["credit"];
      }
    }

    if (credits == 0) {
      returnData.isCompleteText = "Not Done";
    } else if (credits <= 8) {
      returnData.isCompleteText = "Complete";
    } else {
      returnData.isCompleteBool = false;
      returnData.isCompleteText = "Done extra credits";
    }
    returnData.data.totalCredits = credits;
    return returnData;
  },
};

export const btpRule: IRule = {
  ruleId: 9,
  checkRule: (studentCourseData: StudentInfo, context: any): RuleData => {
    let returnData: RuleData = {
      isCompleteBool: true,
      isCompleteText: "Not Done",
      data: {
        totalCredits: 0,
        courses: [],
      },
    };

    const studentCourses = studentCourseData["courses"];
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

      if (courseCodebtp === "BTP") {
        let courseEntry: CourseData = {
          course: course["courseCode"],
          courseName: course["course"],
          semester: course["semester"],
          status: "Complete",
          credits: course["credit"],
          grade: course["grade"],
        };
        returnData.data.courses.push(courseEntry);
      }
    }

    if (credits == 0) {
      returnData.isCompleteText = "Not Done";
    } else if (credits > 0 && credits < 8) {
      returnData.isCompleteText = "Incomplete";
    } else if (credits >= 8) {
      let semesters = [];
      let pairDifferences = [];
      for (let i = 0; i < sem.length; i++) {
        const num1 = parseFloat(sem[i]);
        if (!isNaN(num1)) {
          semesters.push(num1);
        }
      }
      semesters.sort();
      if (semesters.length == 1) {
        returnData.isCompleteText = "Incomplete";
      }
      for (let i = 0; i < semesters.length - 1; i++) {
        const num1 = parseFloat(sem[i]); // Convert the string to a number
        const num2 = parseFloat(sem[i + 1]);
        const difference = Math.abs(num1 - num2); // Calculate the absolute difference
        pairDifferences.push(difference);
      }
      const allOnes = pairDifferences.every((element) => element === 1);
      if (allOnes && credits <= 12) {
        returnData.isCompleteText = "Complete";
      } else if (credits >= 12) {
        returnData.isCompleteText = "Done extra credits";
      } else if (!allOnes) {
        returnData.isCompleteText = "Incomplete";
      }
    }
    returnData.data.totalCredits = credits;
    return returnData;
  },
};

export const incompleteGradeRule: IRule = {
  ruleId: 10,
  checkRule: (studentCourseData: StudentInfo, context: any): RuleData => {
    let returnData: RuleData = {
      isCompleteBool: true,
      isCompleteText: "Complete",
      data: {
        courseData: [],
      },
    };

    const studentCourses = studentCourseData["courses"];
    let credits = 0;
    let incompleteGradePresent = false;

    for (const course of studentCourses) {
      if (course["grade"] == "I") {
        let courseEntry: CourseData = {
          course: course["courseCode"],
          courseName: course["course"],
          semester: course["semester"],
          status: "Incomplete",
          credits: course["credit"],
          grade: course["grade"],
        };
        credits += course["credit"];
        returnData.data.courseData.push(courseEntry);
        incompleteGradePresent = true;
      }
    }

    if (incompleteGradePresent) {
      returnData.isCompleteBool = false;
      returnData.isCompleteText = "Incomplete";
    }
    returnData.data.totalCredits = credits;

    return returnData;
  },
};

export const required156CreditsRule: IRule = {
  ruleId: 11,
  checkRule: (studentCourseData: StudentInfo, context: any): RuleData => {
    let returnData: RuleData = {
      isCompleteBool: false,
      isCompleteText: "Incomplete",
      data: 0,
    };

    const avoidCourses = ["BIP", "BIS", "BUR", "MSC", "BTA", "BTP"];
    const disallowedGrades = ["F", "I", "W", "X"];
    let credits = 0;
    let coursesTaken = new Map<string, number>();

    for (const course of studentCourseData["courses"]) {
      if (
        !coursesTaken.has(course["courseCode"]) &&
        !disallowedGrades.includes(course["grade"]) &&
        !avoidCourses.includes(course["courseCode"].slice(0, 3))
      ) {
        coursesTaken.set(course["courseCode"], course["credit"]);
        credits += course["credit"];
      }

      if (course["courseCode"].startsWith("BTA")) {
        credits += course["credit"];
      }
    }

    credits += Math.min(
      cwRule.checkRule(studentCourseData, context).data.totalCredits,
      2
    );
    credits += Math.min(
      sgRule.checkRule(studentCourseData, context).data.totalCredits,
      2
    );
    credits += Math.min(
      ipRule.checkRule(studentCourseData, context).data.totalCredits,
      8
    );
    const btpReturnData = btpRule.checkRule(studentCourseData, context);
    if (
      btpReturnData.isCompleteText === "Complete" ||
      btpReturnData.isCompleteText === "Done extra credits"
    ) {
      credits += Math.min(btpReturnData.data.totalCredits, 12);
    }

    returnData.data = credits;
    if (credits >= 156) {
      returnData.isCompleteBool = true;
      returnData.isCompleteText = "Complete";
    }
    return returnData;
  },
};
