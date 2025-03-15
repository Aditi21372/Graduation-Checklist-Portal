"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignMinors = exports.QuantumMinors = exports.EntrepreneurshipMinors = exports.EconomicsMinors = exports.ComputationalBiologyMinors = exports.approveApprenticeship = exports.includeIp = exports.checkIpBtpForMinors = exports.isMinors = void 0;
const database_1 = require("./database");
const db_1 = require("./db");
const disallowedGrades = ["I", "W", "F", "X"];
function isMinors(studentInfo) {
    const minors = [];
    const bioMinors = new ComputationalBiologyMinors();
    minors.push(bioMinors.checkMinorsCompleted(studentInfo));
    const ecoMinors = new EconomicsMinors();
    minors.push(ecoMinors.checkMinorsCompleted(studentInfo));
    const entMinors = new EntrepreneurshipMinors();
    minors.push(entMinors.checkMinorsCompleted(studentInfo));
    const designMinors = new DesignMinors();
    minors.push(designMinors.checkMinorsCompleted(studentInfo));
    const quantumMinors = new QuantumMinors();
    minors.push(quantumMinors.checkMinorsCompleted(studentInfo));
    return minors;
}
exports.isMinors = isMinors;
function checkIpBtpForMinors(studentInfo, type) {
    return __awaiter(this, void 0, void 0, function* () {
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
                    const collection = db_1.db.collection("studentsGrade");
                    const ipData = yield collection
                        .find(query)
                        .project(projection)
                        .toArray();
                    if (ipData[0]["IncludedInMinors"] === "No") {
                        data.push(ipData[0]);
                    }
                }
            }
        }
        else {
            const ipCourses = database_1.courseDatabase["IP/IS/UR"];
            for (const course of studentCourses) {
                if (ipCourses.includes(course["courseCode"].substring(0, 3))) {
                    const query = {
                        "Roll No": studentInfo["rollNumber"],
                        "Course Code": course["courseCode"],
                        "Batch / Term Code": course["semester"],
                    };
                    const collection = db_1.db.collection("studentsGrade");
                    const ipData = yield collection
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
    });
}
exports.checkIpBtpForMinors = checkIpBtpForMinors;
function includeIp(ipData, minorsBranch, rollNo) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const collection = db_1.db.collection("studentsGrade");
        try {
            const result = yield collection.updateOne(query, update);
            return result;
        }
        catch (error) {
            console.error("Error updating IncludedInMinors:", error);
            throw error;
        }
    });
}
exports.includeIp = includeIp;
function approveApprenticeship(studentInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = db_1.db.collection("studentsGrade");
        const existingDocument = yield collection.findOne({
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
            const result = yield collection.insertOne(input);
            return result;
        }
        catch (error) {
            console.error("Error adding Apprenticeship:", error);
            throw error;
        }
    });
}
exports.approveApprenticeship = approveApprenticeship;
class ComputationalBiologyMinors {
    constructor() {
        this.coreCourses = database_1.courseDatabase["Minor in BIO"];
    }
    checkSameBranch(studentInfo) {
        return studentInfo["program"].includes("CSB");
    }
    checkMandatoryCourses(studentInfo) {
        const courses = [];
        let totalCredits = 0;
        const totalCreditsPosibble = this.coreCourses.length * 4;
        for (const coreCourse in this.coreCourses) {
            let courseEntry = {
                course: this.coreCourses[coreCourse],
                courseName: "",
                semester: "",
                status: "Not Done",
                credits: 0,
                grade: "",
            };
            for (const course of studentInfo["courses"]) {
                if (course["courseCode"] === this.coreCourses[coreCourse] &&
                    !disallowedGrades.includes(course["grade"])) {
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
        const minorsComponent = {
            isCompleteBool: totalCredits === totalCreditsPosibble,
            isCompleteText: totalCredits === totalCreditsPosibble ? "Complete" : "Not Done",
            totalCredits: totalCredits,
            data: courses,
        };
        return minorsComponent;
    }
    checkAdditionalCredits(studentInfo) {
        const creditsToComplete = 20 - this.coreCourses.length * 4;
        let creditsCompleted = 0;
        const studentCourses = studentInfo["courses"];
        const courses = [];
        for (const studentCourse of studentCourses) {
            const grade = studentCourse["grade"];
            if (studentCourse["courseCode"].startsWith("BIO") &&
                studentCourse["courseCode"].slice(0, 4) >= "BIO3" &&
                !disallowedGrades.includes(grade)) {
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
        const minorsComponent = {
            isCompleteBool: creditsCompleted >= creditsToComplete,
            isCompleteText: creditsCompleted >= creditsToComplete ? "Complete" : "Not Done",
            data: courses,
            totalCredits: creditsCompleted,
        };
        return minorsComponent;
    }
    checkMinorsCompleted(studentInfo) {
        const pursuingCSB = this.checkSameBranch(studentInfo);
        const coreCoursesCompleted = this.checkMandatoryCourses(studentInfo);
        const additionalCreditsCompleted = this.checkAdditionalCredits(studentInfo);
        const ipIncluded = this.includeIp(studentInfo);
        const minors = !pursuingCSB && coreCoursesCompleted.isCompleteBool;
        const totalCredits = coreCoursesCompleted.totalCredits +
            additionalCreditsCompleted.totalCredits +
            ipIncluded.totalCredits;
        const minorsComponent = {
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
    includeIp(studentInfo) {
        const ipCourses = database_1.courseDatabase["IP/IS/UR"];
        const courses = [];
        let totalCredits = 0;
        for (const course of studentInfo["courses"]) {
            if (ipCourses.includes(course["courseCode"].substring(0, 3)) &&
                !disallowedGrades.includes(course["grade"]) &&
                course["includedInMinors"] === "Computational Biology") {
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
        const minorsComponent = {
            isCompleteBool: false,
            isCompleteText: "Not Done",
            totalCredits: totalCredits,
            data: courses,
        };
        return minorsComponent;
    }
}
exports.ComputationalBiologyMinors = ComputationalBiologyMinors;
class EconomicsMinors {
    constructor() {
        this.coreCourses = database_1.courseDatabase["Minor in ECO"];
    }
    checkSameBranch(studentInfo) {
        return studentInfo["program"].includes("CSSS");
    }
    checkMandatoryCourses(studentInfo) {
        const courses = [];
        let totalCredits = 0;
        let totalCreditsPosibble = this.coreCourses.length * 4;
        for (const coreCourse in this.coreCourses) {
            let options = [];
            if (this.coreCourses[coreCourse].length > 6) {
                const splitOptions = this.coreCourses[coreCourse].split("/");
                options.push(...splitOptions);
            }
            let courseEntry = {
                course: this.coreCourses[coreCourse],
                courseName: "",
                semester: "",
                status: "Not Done",
                credits: 0,
                grade: "",
            };
            for (const course of studentInfo["courses"]) {
                if ((course["courseCode"] === this.coreCourses[coreCourse] ||
                    (options.length > 0 && options.includes(course["courseCode"]))) &&
                    !disallowedGrades.includes(course["grade"])) {
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
        const minorsComponent = {
            isCompleteBool: totalCredits === totalCreditsPosibble,
            isCompleteText: totalCredits === totalCreditsPosibble ? "Complete" : "Not Done",
            totalCredits: totalCredits,
            data: courses,
        };
        return minorsComponent;
    }
    checkAdditionalCredits(studentInfo) {
        const creditsToComplete = 20 - this.coreCourses.length * 4;
        let creditsCompleted = 0;
        const studentCourses = studentInfo["courses"];
        const courses = [];
        const coreCourses = [];
        for (const coreCourse in this.coreCourses) {
            if (this.coreCourses[coreCourse].length > 6) {
                const splitOptions = this.coreCourses[coreCourse].split("/");
                coreCourses.push(...splitOptions);
            }
            else {
                coreCourses.push(this.coreCourses[coreCourse]);
            }
        }
        for (const studentCourse of studentCourses) {
            if (studentCourse["courseCode"].startsWith("ECO") &&
                !disallowedGrades.includes(studentCourse["grade"]) &&
                !coreCourses.includes(studentCourse["courseCode"])) {
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
        const minorsComponent = {
            isCompleteBool: creditsCompleted >= creditsToComplete,
            isCompleteText: creditsCompleted >= creditsToComplete ? "Complete" : "Not Done",
            totalCredits: creditsCompleted,
            data: courses,
        };
        return minorsComponent;
    }
    checkMinorsCompleted(studentInfo) {
        const pursuingCSSS = this.checkSameBranch(studentInfo);
        const coreCoursesCompleted = this.checkMandatoryCourses(studentInfo);
        const additionalCreditsCompleted = this.checkAdditionalCredits(studentInfo);
        const ipIncluded = this.includeIp(studentInfo);
        const minors = !pursuingCSSS && coreCoursesCompleted.isCompleteBool;
        const totalCredits = coreCoursesCompleted.totalCredits +
            additionalCreditsCompleted.totalCredits +
            ipIncluded.totalCredits;
        const MinorsComponents = {
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
    includeIp(studentCourseData) {
        const ipCourses = database_1.courseDatabase["IP/IS/UR"];
        const courses = [];
        let totalCredits = 0;
        for (const course of studentCourseData["courses"]) {
            if (ipCourses.includes(course["courseCode"].substring(0, 3)) &&
                !disallowedGrades.includes(course["grade"]) &&
                course["includedInMinors"] === "Economics") {
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
        const minorsComponent = {
            isCompleteBool: false,
            isCompleteText: "Not Done",
            data: courses,
            totalCredits: totalCredits,
        };
        return minorsComponent;
    }
}
exports.EconomicsMinors = EconomicsMinors;
class EntrepreneurshipMinors {
    constructor() {
        this.coreCourses = database_1.courseDatabase["Minor in ENT"];
        this.doneCourses = [];
    }
    checkSameBranch(studentInfo) {
        return false;
    }
    checkMandatoryCourses(studentInfo) {
        const courses = [];
        let totalCredits = 0;
        let totalCreditsPosibble = 16;
        for (const coreCourse of this.coreCourses) {
            let options = [];
            if (coreCourse.length > 6) {
                const splitOptions = coreCourse.split("/");
                options.push(...splitOptions);
            }
            let courseEntry = {
                course: coreCourse,
                courseName: "",
                semester: "",
                status: "Not Done",
                credits: 0,
                grade: "",
            };
            for (const course of studentInfo["courses"]) {
                if ((course["courseCode"] === coreCourse ||
                    (options.length > 0 && options.includes(course["courseCode"]))) &&
                    !disallowedGrades.includes(course["grade"])) {
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
        const minorsComponent = {
            isCompleteBool: totalCredits === totalCreditsPosibble,
            isCompleteText: courses.length === this.coreCourses.length ? "Complete" : "Not Done",
            totalCredits: totalCredits,
            data: courses,
        };
        return minorsComponent;
    }
    checkAdditionalCredits(studentInfo) {
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
                if ((studentCourse["courseCode"] === coreCourse ||
                    (options.length > 0 &&
                        options.includes(studentCourse["courseCode"]))) &&
                    !disallowedGrades.includes(studentCourse["grade"])) {
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
        const minorsComponent = {
            isCompleteBool: creditsCompleted >= creditsToComplete,
            isCompleteText: creditsCompleted >= creditsToComplete ? "Complete" : "Not Done",
            totalCredits: creditsCompleted,
            data: courses,
        };
        return minorsComponent;
    }
    checkMinorsCompleted(studentInfo) {
        const pursuingCSSS = this.checkSameBranch(studentInfo);
        const coreCoursesCompleted = this.checkMandatoryCourses(studentInfo);
        const additionalCreditsCompleted = this.checkAdditionalCredits(studentInfo);
        const ipIncluded = this.includeIp(studentInfo);
        const apprenticeship = this.checkApprenticeship(studentInfo);
        const minors = !pursuingCSSS &&
            coreCoursesCompleted.isCompleteBool &&
            apprenticeship.isCompleteBool;
        const totalCredits = coreCoursesCompleted.totalCredits +
            additionalCreditsCompleted.totalCredits +
            ipIncluded.totalCredits;
        const MinorsComponents = {
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
    includeIp(studentCourseData) {
        const ipCourses = database_1.courseDatabase["IP/IS/UR"];
        const courses = [];
        let totalCredits = 0;
        for (const course of studentCourseData["courses"]) {
            if ((ipCourses.includes(course["courseCode"].substring(0, 3)) ||
                course["courseCode"].substring(0, 3) === "BTP") &&
                !disallowedGrades.includes(course["grade"]) &&
                course["includedInMinors"] === "Entrepreneurship") {
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
        const minorsComponent = {
            isCompleteBool: false,
            isCompleteText: "Not Done",
            data: courses,
            totalCredits: totalCredits,
        };
        return minorsComponent;
    }
    checkApprenticeship(studentInfo) {
        const courses = [];
        for (const course of studentInfo["courses"]) {
            if (course["course"] === "Apprenticeship" &&
                course["includedInMinors"] === "ENT") {
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
        const minorsComponent = {
            isCompleteBool: courses.length > 0,
            isCompleteText: courses.length > 0 ? "Done" : "Not Done",
            data: courses,
            totalCredits: 0,
        };
        return minorsComponent;
    }
}
exports.EntrepreneurshipMinors = EntrepreneurshipMinors;
/*export class QuantumMinors implements Minors {
  coreCourses: string[] = courseDatabase["Minor in Quant bucket 1"] || [];
  electiveCourses: string[] = courseDatabase["Minor in Quant bucket 2"] || [];
  doneCourses: string[] = [];

  checkSameBranch(studentInfo: StudentInfo): boolean {
    return studentInfo.program.includes("none");
  }

  checkMandatoryCourses(studentInfo: StudentInfo): MinorsComponents {
    const courses = [];
    let totalCredits = 0;
    const totalCreditsPossible = 12;

    for (const coreCourse of this.coreCourses) {
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
          course.courseCode === coreCourse &&
          !disallowedGrades.includes(course.grade)
        ) {
          courseEntry.courseName = course.course;
          courseEntry.semester = course.semester;
          courseEntry.status = "Complete";
          courseEntry.credits = course.credit;
          courseEntry.grade = course.grade;
          totalCredits += course.credit;
        }
      }
      courses.push(courseEntry);
    }

    return {
      isCompleteBool: totalCredits >= totalCreditsPossible,
      isCompleteText: totalCredits >= totalCreditsPossible ? "Complete" : "Not Done",
      totalCredits: totalCredits,
      data: courses,
    };
  }

  checkAdditionalCredits(studentInfo: StudentInfo): MinorsComponents {
    const creditsToComplete = 4;
    let creditsCompleted = 0;
    const courses = [];

    for (const electiveCourse of this.electiveCourses) {
      for (const course of studentInfo.courses) {
        if (
          course.courseCode === electiveCourse &&
          !disallowedGrades.includes(course.grade)
        ) {
          courses.push({
            course: course.courseCode,
            courseName: course.course,
            semester: course.semester,
            status: "Complete",
            credits: course.credit,
            grade: course.grade,
          });
          creditsCompleted += course.credit;
          if (creditsCompleted >= creditsToComplete) break;
        }
      }
      if (creditsCompleted >= creditsToComplete) break;
    }

    return {
      isCompleteBool: creditsCompleted >= creditsToComplete,
      isCompleteText: creditsCompleted >= creditsToComplete ? "Complete" : "Not Done",
      totalCredits: creditsCompleted,
      data: courses,
    };
  }

  includeIp(studentInfo: StudentInfo): MinorsComponents {
    const ipCourses = courseDatabase["IP/IS/UR"];
    const courses = [];
    let totalCredits = 0;

    for (const course of studentInfo.courses) {
      if (
        (ipCourses.includes(course.courseCode.substring(0, 3)) ||
          course.courseCode.substring(0, 3) === "BTP") &&
        !disallowedGrades.includes(course.grade) &&
        course.includedInMinors === "Quantum"
      ) {
        courses.push({
          course: course.courseCode,
          courseName: course.course,
          semester: course.semester,
          status: "Complete",
          credits: course.credit,
          grade: course.grade,
        });
        totalCredits += course.credit;
      }
    }

    return {
      isCompleteBool: courses.length > 0,
      isCompleteText: courses.length > 0 ? "Complete" : "Not Done",
      data: courses,
      totalCredits: totalCredits,
    };
  }

  checkMinorsCompleted(studentInfo: StudentInfo): MinorsComponents {
    if (this.checkSameBranch(studentInfo)) {
      return {
        isCompleteBool: false,
        isCompleteText: "Incomplete",
        totalCredits: 0,
        data: {
          stream: "Quantum Technologies",
          coreCoursesCompleted: {
            isCompleteBool: false,
            isCompleteText: "Not Done",
            totalCredits: 0,
            data: []
          },
          additionalCreditsCompleted: {
            isCompleteBool: false,
            isCompleteText: "Not Done",
            totalCredits: 0,
            data: []
          },
          ipIncluded: {
            isCompleteBool: false,
            isCompleteText: "Not Done",
            totalCredits: 0,
            data: []
          }
        }
      };
    }

    const coreCoursesCompleted = this.checkMandatoryCourses(studentInfo);
    const additionalCreditsCompleted = this.checkAdditionalCredits(studentInfo);
    const ipIncluded = this.includeIp(studentInfo);

    const isMinorComplete = coreCoursesCompleted.isCompleteBool &&
                          (additionalCreditsCompleted.isCompleteBool || ipIncluded.isCompleteBool);
    const totalCredits = coreCoursesCompleted.totalCredits +
                       additionalCreditsCompleted.totalCredits +
                       ipIncluded.totalCredits;

    return {
      isCompleteBool: isMinorComplete,
      isCompleteText: isMinorComplete ? "Complete" : "Incomplete",
      totalCredits: totalCredits,
      data: {
        stream: "Quantum Technologies",
        coreCoursesCompleted: {
          isCompleteBool: coreCoursesCompleted.isCompleteBool,
          isCompleteText: coreCoursesCompleted.isCompleteText,
          totalCredits: coreCoursesCompleted.totalCredits,
          data: coreCoursesCompleted.data
        },
        additionalCreditsCompleted: {
          isCompleteBool: additionalCreditsCompleted.isCompleteBool,
          isCompleteText: additionalCreditsCompleted.isCompleteText,
          totalCredits: additionalCreditsCompleted.totalCredits,
          data: additionalCreditsCompleted.data
        },
        ipIncluded: {
          isCompleteBool: ipIncluded.isCompleteBool,
          isCompleteText: ipIncluded.isCompleteText,
          totalCredits: ipIncluded.totalCredits,
          data: ipIncluded.data
        }
      },
    };
  }
}*/
class QuantumMinors {
    constructor() {
        this.coreCourses = database_1.courseDatabase["Minor in Quant bucket 1"] || [];
        this.electiveCourses = database_1.courseDatabase["Minor in Quant bucket 2"] || [];
        this.doneCourses = [];
    }
    // Quantum Minor can be taken by anyone, so we return false here
    checkSameBranch(studentInfo) {
        return false;
    }
    checkMandatoryCourses(studentInfo) {
        const courses = [];
        let totalCredits = 0;
        const totalCreditsPossible = 12;
        const usedCourses = new Set();
        for (const coreCourse of this.coreCourses) {
            let options = coreCourse.includes("/") ? coreCourse.split("/") : [coreCourse];
            for (const course of studentInfo["courses"]) {
                if (options.includes(course["courseCode"]) &&
                    !disallowedGrades.includes(course["grade"]) &&
                    !usedCourses.has(course["courseCode"])) {
                    const courseEntry = {
                        course: coreCourse,
                        courseName: course["course"],
                        semester: course["semester"],
                        status: "Complete",
                        credits: course["credit"],
                        grade: course["grade"],
                    };
                    courses.push(courseEntry);
                    this.doneCourses.push(coreCourse);
                    usedCourses.add(course["courseCode"]);
                    totalCredits += course["credit"];
                    if (totalCredits >= totalCreditsPossible) {
                        totalCredits = totalCreditsPossible;
                        break;
                    }
                }
            }
            if (totalCredits >= totalCreditsPossible) {
                break;
            }
        }
        return {
            isCompleteBool: totalCredits >= totalCreditsPossible,
            isCompleteText: totalCredits >= totalCreditsPossible ? "Complete" : "Not Done",
            totalCredits: totalCredits,
            data: courses,
        };
    }
    // Checking elective course completion (4 credits from Bucket 2)
    checkAdditionalCredits(studentInfo) {
        const courses = [];
        let totalCredits = 0;
        let totalCreditsPosibble = 4;
        for (const electiveCourse of this.electiveCourses) {
            let options = [];
            if (electiveCourse.length > 6) {
                const splitOptions = electiveCourse.split("/");
                options.push(...splitOptions);
            }
            let courseEntry = {
                course: electiveCourse,
                courseName: "",
                semester: "",
                status: "Not Done",
                credits: 0,
                grade: "",
            };
            for (const course of studentInfo["courses"]) {
                if ((course["courseCode"] === electiveCourse ||
                    (options.length > 0 && options.includes(course["courseCode"]))) &&
                    !disallowedGrades.includes(course["grade"])) {
                    courseEntry["courseName"] = course["course"];
                    courseEntry["semester"] = course["semester"];
                    courseEntry["status"] = "Complete";
                    courseEntry["credits"] = course["credit"];
                    courseEntry["grade"] = course["grade"];
                    totalCredits += course["credit"];
                    this.doneCourses.push(electiveCourse);
                    courses.push(courseEntry);
                    if (totalCredits >= totalCreditsPosibble) {
                        break;
                    }
                }
            }
        }
        const minorsComponent = {
            isCompleteBool: totalCredits === totalCreditsPosibble,
            isCompleteText: courses.length === this.electiveCourses.length ? "Complete" : "Not Done",
            totalCredits: totalCredits,
            data: courses,
        };
        return minorsComponent;
    }
    // Checking IP/BTP/UR/IS credits (minimum 4 credits)
    includeIp(studentCourseData) {
        const ipCourses = database_1.courseDatabase["IP/IS/UR"];
        const courses = [];
        let totalCredits = 0;
        for (const course of studentCourseData["courses"]) {
            if ((ipCourses.includes(course["courseCode"].substring(0, 3)) ||
                course["courseCode"].substring(0, 3) === "BTP") &&
                !disallowedGrades.includes(course["grade"]) &&
                course["includedInMinors"] === "Quantum") {
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
        const minorsComponent = {
            isCompleteBool: false,
            isCompleteText: "Not Done",
            data: courses,
            totalCredits: totalCredits,
        };
        return minorsComponent;
    }
    // Final check if the minor is completed
    checkMinorsCompleted(studentInfo) {
        const coreCoursesCompleted = this.checkMandatoryCourses(studentInfo);
        const additionalCreditsCompleted = this.checkAdditionalCredits(studentInfo);
        const ipIncluded = this.includeIp(studentInfo);
        const minors = coreCoursesCompleted.isCompleteBool &&
            (additionalCreditsCompleted.isCompleteBool && ipIncluded.totalCredits > 0);
        const totalCredits = coreCoursesCompleted.totalCredits +
            additionalCreditsCompleted.totalCredits +
            ipIncluded.totalCredits;
        const MinorsComponents = {
            isCompleteBool: minors && totalCredits >= 20,
            isCompleteText: minors && totalCredits >= 20 ? "Complete" : "Not Done",
            totalCredits: totalCredits,
            data: {
                stream: "Quantum Technologies",
                coreCoursesCompleted: Object.assign(Object.assign({}, coreCoursesCompleted), { totalCredits: coreCoursesCompleted }),
                additionalCreditsCompleted: additionalCreditsCompleted,
                ipIncluded: ipIncluded,
            },
        };
        return MinorsComponents;
    }
}
exports.QuantumMinors = QuantumMinors;
class DesignMinors {
    constructor() {
        this.coreCourses = database_1.courseDatabase["Minor in Design"];
        this.doneCourses = [];
    }
    checkSameBranch(studentInfo) {
        return studentInfo.program.includes("CSD");
    }
    checkMandatoryCourses(studentInfo) {
        let totalCredits = 0;
        const courses = [];
        let totalCreditsPossible = 12;
        for (const coreCourse of this.coreCourses) {
            let options = coreCourse.includes("/") ? coreCourse.split("/") : [];
            let courseEntry = {
                course: coreCourse,
                courseName: "",
                semester: "",
                status: "Not Done",
                credits: 0,
                grade: "",
            };
            for (const course of studentInfo.courses) {
                if ((course.courseCode === coreCourse ||
                    (options.length > 0 && options.includes(course.courseCode))) &&
                    !disallowedGrades.includes(course.grade)) {
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
            isCompleteText: totalCredits === totalCreditsPossible ? "Complete" : "Not Done",
            totalCredits,
            data: courses,
        };
    }
    checkAdditionalCredits(studentInfo) {
        const creditsToComplete = 8;
        let creditsCompleted = 0;
        const courses = [];
        for (const studentCourse of studentInfo.courses) {
            // Extract the numeric part of the course code
            const courseNumber = parseInt(studentCourse.courseCode.substring(3));
            if (studentCourse.courseCode.startsWith("DES") &&
                courseNumber >= 200 &&
                !disallowedGrades.includes(studentCourse.grade) &&
                !this.doneCourses.includes(studentCourse.courseCode)) {
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
    includeIp(studentCourseData) {
        const ipCourses = database_1.courseDatabase["IP/IS/UR"];
        const courses = [];
        let totalCredits = 0;
        for (const course of studentCourseData["courses"]) {
            if ((ipCourses.includes(course["courseCode"].substring(0, 3)) ||
                course["courseCode"].substring(0, 3) === "BTP") &&
                !disallowedGrades.includes(course["grade"]) &&
                course["includedInMinors"] === "Design") {
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
        const minorsComponent = {
            isCompleteBool: courses.length > 0,
            isCompleteText: courses.length > 0 ? "Complete" : "Not Done",
            data: courses,
            totalCredits: totalCredits,
        };
        return minorsComponent;
    }
    checkMinorsCompleted(studentInfo) {
        if (this.checkSameBranch(studentInfo)) {
            return {
                isCompleteBool: false,
                isCompleteText: "Not Done",
                totalCredits: 0,
                data: {
                    stream: "Design",
                    coreCoursesCompleted: { data: [] },
                    additionalCreditsCompleted: { data: [] },
                    ipIncluded: { data: [] }
                }
            };
        }
        const coreCoursesCompleted = this.checkMandatoryCourses(studentInfo);
        const additionalCreditsCompleted = this.checkAdditionalCredits(studentInfo);
        const ipIncluded = this.includeIp(studentInfo);
        const isMinorComplete = coreCoursesCompleted.isCompleteBool &&
            (additionalCreditsCompleted.isCompleteBool || ipIncluded.isCompleteBool);
        const totalCredits = coreCoursesCompleted.totalCredits +
            additionalCreditsCompleted.totalCredits +
            ipIncluded.totalCredits;
        return {
            isCompleteBool: isMinorComplete,
            isCompleteText: isMinorComplete ? "Done" : "Not Done",
            totalCredits: totalCredits,
            data: {
                stream: "Design",
                coreCoursesCompleted: coreCoursesCompleted,
                additionalCreditsCompleted: additionalCreditsCompleted,
                ipIncluded: ipIncluded
            },
        };
    }
}
exports.DesignMinors = DesignMinors;
