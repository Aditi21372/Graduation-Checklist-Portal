import { StudentInfo, MinorsComponents, CourseData } from "./type";
import { courseDatabase } from "./database";
import { db } from "./db";

const disallowedGrades = ["I", "W", "F", "X"];

export function isMinors(studentInfo: StudentInfo): MinorsComponents[] {
  const minors: MinorsComponents[] = [];
  const bioMinors = new ComputationalBiologyMinors();
  minors.push(bioMinors.checkMinorsCompleted(studentInfo));
  const ecoMinors = new EconomicsMinors();
  minors.push(ecoMinors.checkMinorsCompleted(studentInfo));
  const entMinors = new EntrepreneurshipMinors();
  minors.push(entMinors.checkMinorsCompleted(studentInfo));
  //const quantMinors = new QuantMinors()
  //minors.push(quantMinors.checkMinorsCompleted(studentInfo));
  const designMinors = new DesignMinors();
  minors.push(designMinors.checkMinorsCompleted(studentInfo));
  return minors;
}

export async function checkIpBtpForMinors(
  studentInfo: StudentInfo,
  type: string
): Promise<any> {
  const studentCourses = studentInfo["courses"];
  const projection = {
    _id: 0,
    "Course Code": 1,
    Course: 1,
    Credit: 1,
    Grade: 1,
    "Batch / Term Code": 1,
    IncludedInMinors: 1,
  };
  const data = [];

  if (type === "BTP") {
    for (const course of studentCourses) {
      if (course["courseCode"].substring(0, 3) === "BTP") {
        const query = {
          "Roll No": studentInfo["rollNumber"],
          "Course Code": course["courseCode"],
          "Batch / Term Code": course["semester"],
        };
        const collection = db.collection("studentsGrade");
        const ipData = await collection
          .find(query)
          .project(projection)
          .toArray();
        if (ipData[0]["IncludedInMinors"] === "No") {
          data.push(ipData[0]);
        }
      }
    }
  } else {
    const ipCourses = courseDatabase["IP/IS/UR"];

    for (const course of studentCourses) {
      if (ipCourses.includes(course["courseCode"].substring(0, 3))) {
        const query = {
          "Roll No": studentInfo["rollNumber"],
          "Course Code": course["courseCode"],
          "Batch / Term Code": course["semester"],
        };
        const collection = db.collection("studentsGrade");
        const ipData = await collection
          .find(query)
          .project(projection)
          .toArray();
        if (ipData[0]["IncludedInMinors"] === "No") {
          data.push(ipData[0]);
        }
      }
    }
  }
  return data;
}

export async function includeIp(
  ipData: any,
  minorsBranch: string,
  rollNo: number
) {
  const query = {
    "Roll No": rollNo,
    "Course Code": ipData["Course Code"],
    "Grade": ipData["Grade"]
  };
  const update = {
    $set: {
      IncludedInMinors: minorsBranch,
    },
  };
  const collection = db.collection("studentsGrade");
  try {
    const result = await collection.updateOne(query, update);
    return result;
  } catch (error) {
    console.error("Error updating IncludedInMinors:", error);
    throw error;
  }
}

export async function approveApprenticeship(studentInfo: StudentInfo) {
  const collection = db.collection("studentsGrade");

  const existingDocument = await collection.findOne({
    "Roll No": studentInfo["rollNumber"],
    Course: "Apprenticeship",
  });

  if (existingDocument) {
    return null;
  }

  const input = {
    "SN.": 0,
    Batch: studentInfo["batch"],
    "Roll No": studentInfo["rollNumber"],
    "Student Name": studentInfo["studentName"],
    Program: studentInfo["program"],
    "Batch / Term Code": "Summer Term",
    "Course Code": "NULL",
    Course: "Apprenticeship",
    "Course Type": "Internship",
    Credit: 0,
    Grade: "",
    SPI: "",
    CPI: "",
    IncludedInMinors: "ENT",
  };

  try {
    const result = await collection.insertOne(input);
    return result;
  } catch (error) {
    console.error("Error adding Apprenticeship:", error);
    throw error;
  }
}

export interface Minors {
  // List the core courses required to be completed for the minors.
  coreCourses: string[];
  // Check if not in same branch
  checkSameBranch: (studentInfo: StudentInfo) => Boolean;
  // Checks if the minimum number of course work credits have been completed.
  checkMandatoryCourses: (studentInfo: StudentInfo) => MinorsComponents;
  // Checks if an additional number of credits have been completed through IP/BTP/coursework/etc.
  checkAdditionalCredits: (studentInfo: StudentInfo) => MinorsComponents;
  // Checks if all the minor requirements have been completed.
  checkMinorsCompleted: (studentInfo: StudentInfo) => MinorsComponents;

  includeIp: (studentInfo: StudentInfo) => MinorsComponents;
}

export class ComputationalBiologyMinors implements Minors {
  coreCourses: string[] = courseDatabase["Minor in BIO"];
  

  checkSameBranch(studentInfo: StudentInfo): boolean {
    return studentInfo["program"].includes("CSB");
  }

  checkMandatoryCourses(studentInfo: StudentInfo): MinorsComponents {
    const courses = [];
    let totalCredits = 0;
    const totalCreditsPosibble = this.coreCourses.length * 4;

    for (const coreCourse in this.coreCourses) {
      let courseEntry: CourseData = {
        course: this.coreCourses[coreCourse],
        courseName: "",
        semester: "",
        status: "Not Done",
        credits: 0,
        grade: "",
      };
      for (const course of studentInfo["courses"]) {
        if (
          course["courseCode"] === this.coreCourses[coreCourse] &&
          !disallowedGrades.includes(course["grade"])
        ) {
          courseEntry["courseName"] = course["course"];
          courseEntry["semester"] = course["semester"];
          courseEntry["status"] = "Complete";
          courseEntry["credits"] = course["credit"];
          courseEntry["grade"] = course["grade"];

          totalCredits += course["credit"];
        }
      }
      courses.push(courseEntry);
    }
    const minorsComponent: MinorsComponents = {
      isCompleteBool: totalCredits === totalCreditsPosibble,
      isCompleteText:
        totalCredits === totalCreditsPosibble ? "Complete" : "Not Done",
      totalCredits: totalCredits,
      data: courses,
    };

    return minorsComponent;
  }

  checkAdditionalCredits(studentInfo: StudentInfo): MinorsComponents {
    const creditsToComplete = 20 - this.coreCourses.length * 4;
    let creditsCompleted = 0;
    const studentCourses = studentInfo["courses"];
    const courses = [];

    for (const studentCourse of studentCourses) {
      const grade = studentCourse["grade"];

      if (
        studentCourse["courseCode"].startsWith("BIO") &&
        studentCourse["courseCode"].slice(0, 4) >= "BIO3" &&
        !disallowedGrades.includes(grade)
      ) {
        creditsCompleted += studentCourse["credit"];
        courses.push({
          course: studentCourse["courseCode"],
          courseName: studentCourse["course"],
          semester: studentCourse["semester"],
          status: "Complete",
          credits: studentCourse["credit"],
          grade: studentCourse["grade"],
        });
      }
    }

    const minorsComponent: MinorsComponents = {
      isCompleteBool: creditsCompleted >= creditsToComplete,
      isCompleteText:
        creditsCompleted >= creditsToComplete ? "Complete" : "Not Done",
      data: courses,
      totalCredits: creditsCompleted,
    };
    return minorsComponent;
  }

  checkMinorsCompleted(studentInfo: StudentInfo): MinorsComponents {
    const pursuingCSB = this.checkSameBranch(studentInfo);
    const coreCoursesCompleted = this.checkMandatoryCourses(studentInfo);
    const additionalCreditsCompleted = this.checkAdditionalCredits(studentInfo);
    const ipIncluded = this.includeIp(studentInfo);
    const minors = !pursuingCSB && coreCoursesCompleted.isCompleteBool;
    const totalCredits =
      coreCoursesCompleted.totalCredits +
      additionalCreditsCompleted.totalCredits +
      ipIncluded.totalCredits;
    const minorsComponent: MinorsComponents = {
      isCompleteBool: minors && totalCredits >= 20,
      isCompleteText: minors && totalCredits >= 20 ? "Complete" : "Not Done",
      totalCredits: totalCredits,
      data: {
        stream: "Computational Biology",
        coreCoursesCompleted: coreCoursesCompleted,
        additionalCreditsCompleted: additionalCreditsCompleted,
        ipIncluded: ipIncluded,
      },
    };
    return minorsComponent;
  }

  includeIp(studentInfo: StudentInfo): MinorsComponents {
    const ipCourses = courseDatabase["IP/IS/UR"];
    const courses = [];
    let totalCredits = 0;

    for (const course of studentInfo["courses"]) {
      if (
        ipCourses.includes(course["courseCode"].substring(0, 3)) &&
        !disallowedGrades.includes(course["grade"]) &&
        course["includedInMinors"] === "Computational Biology"
      ) {
        courses.push({
          course: course["courseCode"],
          courseName: course["course"],
          semester: course["semester"],
          status: "Complete",
          credits: course["credit"],
          grade: course["grade"],
        });

        totalCredits += course["credit"];
      }
    }
    const minorsComponent: MinorsComponents = {
      isCompleteBool: false,
      isCompleteText: "Not Done",
      totalCredits: totalCredits,
      data: courses,
    };
    return minorsComponent;
  }
}

export class EconomicsMinors implements Minors {
  coreCourses: string[] = courseDatabase["Minor in ECO"];

  checkSameBranch(studentInfo: StudentInfo): boolean {
    return studentInfo["program"].includes("CSSS");
  }

  checkMandatoryCourses(studentInfo: StudentInfo): MinorsComponents {
    const courses = [];
    let totalCredits = 0;
    let totalCreditsPosibble = this.coreCourses.length * 4;

    for (const coreCourse in this.coreCourses) {
      let options = [];
      if (this.coreCourses[coreCourse].length > 6) {
        const splitOptions = this.coreCourses[coreCourse].split("/");
        options.push(...splitOptions);
      }
      let courseEntry: CourseData = {
        course: this.coreCourses[coreCourse],
        courseName: "",
        semester: "",
        status: "Not Done",
        credits: 0,
        grade: "",
      };

      for (const course of studentInfo["courses"]) {
        if (
          (course["courseCode"] === this.coreCourses[coreCourse] ||
            (options.length > 0 && options.includes(course["courseCode"]))) &&
          !disallowedGrades.includes(course["grade"])
        ) {
          courseEntry["courseName"] = course["course"];
          courseEntry["semester"] = course["semester"];
          courseEntry["status"] = "Complete";
          courseEntry["credits"] = course["credit"];
          courseEntry["grade"] = course["grade"];

          totalCredits += course["credit"];
        }
      }
      courses.push(courseEntry);
    }
    const minorsComponent: MinorsComponents = {
      isCompleteBool: totalCredits === totalCreditsPosibble,
      isCompleteText:
        totalCredits === totalCreditsPosibble ? "Complete" : "Not Done",
      totalCredits: totalCredits,
      data: courses,
    };
    return minorsComponent;
  }

  checkAdditionalCredits(studentInfo: StudentInfo): MinorsComponents {
    const creditsToComplete = 20 - this.coreCourses.length * 4;
    let creditsCompleted = 0;
    const studentCourses = studentInfo["courses"];
    const courses = [];

    const coreCourses = [];
    for (const coreCourse in this.coreCourses) {
      if (this.coreCourses[coreCourse].length > 6) {
        const splitOptions = this.coreCourses[coreCourse].split("/");
        coreCourses.push(...splitOptions);
      } else {
        coreCourses.push(this.coreCourses[coreCourse]);
      }
    }

    for (const studentCourse of studentCourses) {
      if (
        studentCourse["courseCode"].startsWith("ECO") &&
        !disallowedGrades.includes(studentCourse["grade"]) &&
        !coreCourses.includes(studentCourse["courseCode"])
      ) {
        creditsCompleted += studentCourse["credit"];
        courses.push({
          course: studentCourse["courseCode"],
          courseName: studentCourse["course"],
          semester: studentCourse["semester"],
          status: "Complete",
          credits: studentCourse["credit"],
          grade: studentCourse["grade"],
        });
      }
    }

    const minorsComponent: MinorsComponents = {
      isCompleteBool: creditsCompleted >= creditsToComplete,
      isCompleteText:
        creditsCompleted >= creditsToComplete ? "Complete" : "Not Done",
      totalCredits: creditsCompleted,
      data: courses,
    };
    return minorsComponent;
  }

  checkMinorsCompleted(studentInfo: StudentInfo): MinorsComponents {
    const pursuingCSSS = this.checkSameBranch(studentInfo);
    const coreCoursesCompleted = this.checkMandatoryCourses(studentInfo);
    const additionalCreditsCompleted = this.checkAdditionalCredits(studentInfo);
    const ipIncluded = this.includeIp(studentInfo);
    const minors = !pursuingCSSS && coreCoursesCompleted.isCompleteBool;
    const totalCredits =
      coreCoursesCompleted.totalCredits +
      additionalCreditsCompleted.totalCredits +
      ipIncluded.totalCredits;
    const MinorsComponents: MinorsComponents = {
      isCompleteBool: minors && totalCredits >= 20,
      isCompleteText: minors && totalCredits >= 20 ? "Complete" : "Not Done",
      totalCredits: totalCredits,
      data: {
        stream: "Economics",
        coreCoursesCompleted: coreCoursesCompleted,
        additionalCreditsCompleted: additionalCreditsCompleted,
        ipIncluded: ipIncluded,
      },
    };
    return MinorsComponents;
  }

  includeIp(studentCourseData: StudentInfo): MinorsComponents {
    const ipCourses = courseDatabase["IP/IS/UR"];
    const courses = [];
    let totalCredits = 0;
    for (const course of studentCourseData["courses"]) {
      if (
        ipCourses.includes(course["courseCode"].substring(0, 3)) &&
        !disallowedGrades.includes(course["grade"]) &&
        course["includedInMinors"] === "Economics"
      ) {
        courses.push({
          course: course["courseCode"],
          courseName: course["course"],
          semester: course["semester"],
          status: "Complete",
          credits: course["credit"],
          grade: course["grade"],
        });

        totalCredits += course["credit"];
      }
    }

    const minorsComponent: MinorsComponents = {
      isCompleteBool: false,
      isCompleteText: "Not Done",
      data: courses,
      totalCredits: totalCredits,
    };
    return minorsComponent;
  }
}

export class EntrepreneurshipMinors implements Minors {
  coreCourses: string[] = courseDatabase["Minor in ENT"];
  doneCourses: string[] = [];

  checkSameBranch(studentInfo: StudentInfo): boolean {
    return false;
  }

  checkMandatoryCourses(studentInfo: StudentInfo): MinorsComponents {
    const courses = [];
    let totalCredits = 0;
    let totalCreditsPosibble = 16;

    for (const coreCourse of this.coreCourses) {
      let options = [];
      if (coreCourse.length > 6) {
        const splitOptions = coreCourse.split("/");
        options.push(...splitOptions);
      }
      let courseEntry: CourseData = {
        course: coreCourse,
        courseName: "",
        semester: "",
        status: "Not Done",
        credits: 0,
        grade: "",
      };

      for (const course of studentInfo["courses"]) {
        if (
          (course["courseCode"] === coreCourse ||
            (options.length > 0 && options.includes(course["courseCode"]))) &&
          !disallowedGrades.includes(course["grade"])
        ) {
          courseEntry["courseName"] = course["course"];
          courseEntry["semester"] = course["semester"];
          courseEntry["status"] = "Complete";
          courseEntry["credits"] = course["credit"];
          courseEntry["grade"] = course["grade"];

          totalCredits += course["credit"];
          this.doneCourses.push(coreCourse);
          courses.push(courseEntry);

          if (totalCredits >= totalCreditsPosibble) {
            break;
          }
        }
      }
    }
    const minorsComponent: MinorsComponents = {
      isCompleteBool: totalCredits === totalCreditsPosibble,
      isCompleteText:
        courses.length === this.coreCourses.length ? "Complete" : "Not Done",
      totalCredits: totalCredits,
      data: courses,
    };
    return minorsComponent;
  }

  checkAdditionalCredits(studentInfo: StudentInfo): MinorsComponents {
    const creditsToComplete = 8;
    let creditsCompleted = 0;
    const studentCourses = studentInfo["courses"];
    const courses = [];

    for (const coreCourse of this.coreCourses) {
      if (this.doneCourses.includes(coreCourse)) {
        continue;
      }
      let options = [];
      if (coreCourse.length > 6) {
        const splitOptions = coreCourse.split("/");
        options.push(...splitOptions);
      }

      for (const studentCourse of studentCourses) {
        if (
          (studentCourse["courseCode"] === coreCourse ||
            (options.length > 0 &&
              options.includes(studentCourse["courseCode"]))) &&
          !disallowedGrades.includes(studentCourse["grade"])
        ) {
          creditsCompleted += studentCourse["credit"];
          courses.push({
            course: coreCourse,
            courseName: studentCourse["course"],
            semester: studentCourse["semester"],
            status: "Complete",
            credits: studentCourse["credit"],
            grade: studentCourse["grade"],
          });
        }
      }
    }

    const minorsComponent: MinorsComponents = {
      isCompleteBool: creditsCompleted >= creditsToComplete,
      isCompleteText:
        creditsCompleted >= creditsToComplete ? "Complete" : "Not Done",
      totalCredits: creditsCompleted,
      data: courses,
    };
    return minorsComponent;
  }

  checkMinorsCompleted(studentInfo: StudentInfo): MinorsComponents {
    const pursuingCSSS = this.checkSameBranch(studentInfo);
    const coreCoursesCompleted = this.checkMandatoryCourses(studentInfo);
    const additionalCreditsCompleted = this.checkAdditionalCredits(studentInfo);
    const ipIncluded = this.includeIp(studentInfo);
    const apprenticeship = this.checkApprenticeship(studentInfo);
    const minors =
      !pursuingCSSS &&
      coreCoursesCompleted.isCompleteBool &&
      apprenticeship.isCompleteBool;
    const totalCredits =
      coreCoursesCompleted.totalCredits +
      additionalCreditsCompleted.totalCredits +
      ipIncluded.totalCredits;
    const MinorsComponents: MinorsComponents = {
      isCompleteBool: minors && totalCredits >= 24,
      isCompleteText: minors && totalCredits >= 24 ? "Complete" : "Not Done",
      totalCredits: totalCredits,
      data: {
        stream: "Entrepreneurship",
        coreCoursesCompleted: coreCoursesCompleted,
        additionalCreditsCompleted: additionalCreditsCompleted,
        ipIncluded: ipIncluded,
        apprenticeship: apprenticeship,
      },
    };
    return MinorsComponents;
  }

  includeIp(studentCourseData: StudentInfo): MinorsComponents {
    const ipCourses = courseDatabase["IP/IS/UR"];
    const courses = [];
    let totalCredits = 0;
    for (const course of studentCourseData["courses"]) {
      if (
        (ipCourses.includes(course["courseCode"].substring(0, 3)) ||
          course["courseCode"].substring(0, 3) === "BTP") &&
        !disallowedGrades.includes(course["grade"]) &&
        course["includedInMinors"] === "Entrepreneurship"
      ) {
        courses.push({
          course: course["courseCode"],
          courseName: course["course"],
          semester: course["semester"],
          status: "Complete",
          credits: course["credit"],
          grade: course["grade"],
        });

        totalCredits += course["credit"];
      }
    }

    const minorsComponent: MinorsComponents = {
      isCompleteBool: false,
      isCompleteText: "Not Done",
      data: courses,
      totalCredits: totalCredits,
    };
    return minorsComponent;
  }

  checkApprenticeship(studentInfo: StudentInfo): MinorsComponents {
    const courses = [];
    for (const course of studentInfo["courses"]) {
      if (
        course["course"] === "Apprenticeship" &&
        course["includedInMinors"] === "ENT"
      ) {
        courses.push({
          course: course["courseCode"],
          courseName: course["course"],
          semester: course["semester"],
          status: "Complete",
          credits: course["credit"],
          grade: course["grade"],
        });
      }
    }

    const minorsComponent: MinorsComponents = {
      isCompleteBool: courses.length > 0,
      isCompleteText: courses.length > 0 ? "Done" : "Not Done",
      data: courses,
      totalCredits: 0,
    };
    return minorsComponent;
  }
}


//design-minors


export class DesignMinors implements Minors {
  coreCourses: string[] = courseDatabase["Minor in Design"];
  
  doneCourses: string[] = [];

  checkSameBranch(studentInfo: StudentInfo): boolean {
    return studentInfo.program.includes("CSD");
  }

  checkMandatoryCourses(studentInfo: StudentInfo): MinorsComponents {
    let totalCredits = 0;
    const courses: CourseData[] = [];
    let totalCreditsPossible = 12;

    for (const coreCourse of this.coreCourses) {
      let options = coreCourse.includes("/") ? coreCourse.split("/") : [];
      let courseEntry: CourseData = {
        course: coreCourse,
        courseName: "",
        semester: "",
        status: "Not Done",
        credits: 0,
        grade: "",
      };

      for (const course of studentInfo.courses) {
        if (
          (course.courseCode === coreCourse ||
            (options.length > 0 && options.includes(course.courseCode))) &&
          !disallowedGrades.includes(course.grade)
        ) {
          Object.assign(courseEntry, {
            courseName: course.course,
            semester: course.semester,
            status: "Complete",
            credits: course.credit,
            grade: course.grade,
          });
          totalCredits += course.credit;
          this.doneCourses.push(coreCourse);
          courses.push(courseEntry);

          if (totalCredits >= totalCreditsPossible) {
            break;
          }
        }
      }
    }

    return {
      isCompleteBool: totalCredits === totalCreditsPossible,
      isCompleteText: totalCredits === totalCreditsPossible ? "Done" : "Not Done",
      totalCredits,
      data: courses,
    };
  }

  checkAdditionalCredits(studentInfo: StudentInfo): MinorsComponents {
    const creditsToComplete = 8;
    let creditsCompleted = 0;
    const courses: CourseData[] = [];

    for (const studentCourse of studentInfo.courses) {
      if (
        studentCourse.courseCode.startsWith("DES") &&
        !disallowedGrades.includes(studentCourse.grade) &&
        !this.doneCourses.includes(studentCourse.courseCode)
      ) {
        courses.push({
          course: studentCourse.courseCode,
          courseName: studentCourse.course,
          semester: studentCourse.semester,
          status: "Complete",
          credits: studentCourse.credit,
          grade: studentCourse.grade,
        });
        creditsCompleted += studentCourse.credit;
      }
    }

    return {
      isCompleteBool: creditsCompleted >= creditsToComplete,
      isCompleteText: creditsCompleted >= creditsToComplete ? "Complete" : "Not Done",
      totalCredits: creditsCompleted,
      data: courses,
    };
  }

  includeIp(studentCourseData: StudentInfo): MinorsComponents {
    const ipCourses = courseDatabase["IP/IS/UR"];
    const courses = [];
    let totalCredits = 0;
    for (const course of studentCourseData["courses"]) {
      if (
        (ipCourses.includes(course["courseCode"].substring(0, 3)) ||
          course["courseCode"].substring(0, 3) === "BTP") &&
        !disallowedGrades.includes(course["grade"]) &&
        course["includedInMinors"] === ""
      ) {
        courses.push({
          course: course["courseCode"],
          courseName: course["course"],
          semester: course["semester"],
          status: "Complete",
          credits: course["credit"],
          grade: course["grade"],
        });

        totalCredits += course["credit"];
      }
    }

    const minorsComponent: MinorsComponents = {
      isCompleteBool: false,
      isCompleteText: "Not Done",
      data: courses,
      totalCredits: totalCredits,
    };
    return minorsComponent;
  }

  checkMinorsCompleted(studentInfo: StudentInfo): MinorsComponents {
    if (this.checkSameBranch(studentInfo)) {
      return { isCompleteBool: false, isCompleteText: "Incomplete", totalCredits: 0, data: {} };
    }

    const mandatoryCourses = this.checkMandatoryCourses(studentInfo);
    const additionalCredits = this.checkAdditionalCredits(studentInfo);
    const ipIncluded = this.includeIp(studentInfo);

    const isMinorComplete = mandatoryCourses.isCompleteBool && (additionalCredits.isCompleteBool || ipIncluded.isCompleteBool);
    const totalCredits = mandatoryCourses.totalCredits + additionalCredits.totalCredits + ipIncluded.totalCredits;

    return {
      isCompleteBool: isMinorComplete,
      isCompleteText: isMinorComplete ? "Complete" : "Incomplete",
      totalCredits,
      data: {
        stream: "Design",
        mandatoryCourses,
        additionalCredits,
        ipIncluded,
      },
    };
  }
}


//quant minors


