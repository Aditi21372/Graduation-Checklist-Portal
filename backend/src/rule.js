"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRules = exports.combinesCsssRule = exports.sshMajor = exports.ecoMajorElective = exports.ecoMajorCore = exports.csaiMathsCoreRule = exports.csaiApplicationRule = exports.csaiCoreRule = exports.csaiCseCoreRule = exports.required156CreditsRule = exports.incompleteGradeRule = exports.btpRule = exports.twoxxRule = exports.onlineCoursesRule = exports.ipRule = exports.thirtyTwoCreditsRule = exports.sgRule = exports.cwRule = exports.sshRule = exports.mandatoryBucketRule = exports.mandatoryCoreRule = exports.disallowedGrades = exports.gradeHierarchy = void 0;
const database_1 = require("./database");
exports.gradeHierarchy = [
    "A+",
    "A",
    "A-",
    "B",
    "B-",
    "C",
    "C-",
    "D",
    "I",
    "S",
    "W",
    "F",
    "X",
    "",
];
exports.disallowedGrades = ["I", "S", "W", "F", "X"];
exports.mandatoryCoreRule = {
    ruleId: 0,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Complete",
            data: {
                coreCourses: [],
                totalCredits: 0,
            },
        };
        context = context ? context : "CSE";
        const coreCourses = database_1.courseDatabase[context];
        const studentCourses = studentCourseData["courses"];
        let studentCoreCourse = [];
        for (const courseCode of coreCourses) {
            let courseEntry = {
                course: courseCode,
                courseName: "",
                semester: "",
                status: "Incomplete",
                credits: 0,
                grade: "",
            };
            for (const studentCourse of studentCourses) {
                if (studentCourse["courseCode"] === courseCode) {
                    if (!exports.disallowedGrades.includes(studentCourse["grade"])) {
                        courseEntry.status = "Complete";
                        courseEntry.credits = studentCourse["credit"];
                        courseEntry.semester = studentCourse["semester"];
                        courseEntry.courseName = studentCourse["course"];
                        const currentGradeIndex = exports.gradeHierarchy.indexOf(courseEntry.grade);
                        const gradeIndex = exports.gradeHierarchy.indexOf(studentCourse["grade"]);
                        if (gradeIndex < currentGradeIndex) {
                            courseEntry.grade = studentCourse["grade"];
                        }
                    }
                    else {
                        if (courseEntry.status == "Complete")
                            continue;
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
        for (const course of studentCourses) {
            if (course.includedInMinors.length >= 6) {
                const index = studentCoreCourse.findIndex((element) => element.course === course.includedInMinors);
                if (index != -1) {
                    studentCoreCourse[index].status = "Complete";
                    studentCoreCourse[index].credits = course.credit;
                    studentCoreCourse[index].grade = course.grade;
                    studentCoreCourse[index].semester = course.semester;
                    studentCoreCourse[index].courseName = course.course;
                    studentCoreCourse[index].course =
                        course.courseCode + "/" + course.includedInMinors;
                    returnData.data.totalCredits += course.credit;
                }
            }
        }
        for (let i = 0; i < studentCoreCourse.length; i++) {
            if (studentCoreCourse[i].status !== "Complete") {
                returnData.isCompleteBool = false;
                returnData.isCompleteText = "Incomplete";
            }
            else {
                returnData.data.totalCredits += studentCoreCourse[i].credits;
            }
        }
        returnData.data.coreCourses = studentCoreCourse;
        return returnData;
    },
};
exports.mandatoryBucketRule = {
    ruleId: 1,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Complete",
            data: {
                studentBucketCourses: [],
                completedBuckets: [],
                totalCredits: 0,
            },
        };
        context = context ? context : "CSE";
        const bucketName = context + " bucket";
        const mandatoryBuckets = [];
        const studentCourses = studentCourseData["courses"];
        let studentBucketCourse = [];
        let completedBuckets = [];
        for (const key of Object.keys(database_1.courseDatabase)) {
            if (key.startsWith(bucketName)) {
                mandatoryBuckets.push(database_1.courseDatabase[key]);
            }
        }
        for (const courseBucket of mandatoryBuckets) {
            let mandateBucket = [];
            for (const courseCode of courseBucket) {
                let courseEntry = {
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
                        if (!exports.disallowedGrades.includes(studentCourse["grade"])) {
                            courseEntry.status = "Complete";
                            courseEntry.credits = studentCourse["credit"];
                            courseEntry.semester = studentCourse["semester"];
                            const currentGradeIndex = exports.gradeHierarchy.indexOf(courseEntry.grade);
                            const gradeIndex = exports.gradeHierarchy.indexOf(studentCourse["grade"]);
                            if (gradeIndex < currentGradeIndex) {
                                courseEntry.grade = studentCourse["grade"];
                            }
                        }
                        else {
                            if (studentCourse.grade === "F") {
                                const index = studentCourses.findIndex((element) => element.includedInMinors === courseEntry.course);
                                if (index != -1) {
                                    courseEntry.status = "Complete";
                                    courseEntry.credits = studentCourses[index].credit;
                                    courseEntry.grade = studentCourses[index].grade;
                                    courseEntry.semester = studentCourses[index].semester;
                                    courseEntry.courseName = studentCourses[index].course;
                                    courseEntry.course =
                                        studentCourses[index].courseCode +
                                            "/" +
                                            studentCourses[index].includedInMinors;
                                    returnData.data.totalCredits += studentCourses[index].credit;
                                }
                            }
                            if (courseEntry.status != "Complete") {
                                courseEntry.status =
                                    studentCourse["grade"] === "F" ? "Failed" : "Incomplete";
                                courseEntry.credits = 0;
                                courseEntry.grade = studentCourse["grade"];
                                courseEntry.semester = studentCourse["semester"];
                            }
                        }
                    }
                }
                mandateBucket.push(courseEntry);
            }
            studentBucketCourse.push(mandateBucket);
        }
        for (let i = 0; i < studentBucketCourse.length; i++) {
            let atleastOne = false;
            for (let course of studentBucketCourse[i]) {
                if (course.status === "Complete") {
                    returnData.data.totalCredits += course.credits;
                    atleastOne = true;
                }
            }
            if (!atleastOne) {
                returnData.isCompleteBool = false;
                returnData.isCompleteText = "Incomplete";
                completedBuckets.push(false);
            }
            else {
                completedBuckets.push(true);
            }
        }
        returnData.data.studentBucketCourses = studentBucketCourse;
        returnData.data.completedBuckets = completedBuckets;
        return returnData;
    },
};
exports.sshRule = {
    ruleId: 2,
    checkRule: (studentCourseData, context) => {
        const sshCourses = database_1.courseDatabase["SSH Courses"];
        const studentCourses = studentCourseData["courses"];
        const branch = context ? context : "CSE";
        let coursesTaken = new Map();
        let credits = 0;
        let returnData = {
            isCompleteText: "Incomplete",
            isCompleteBool: false,
            data: {
                courses: [],
                totalCredits: 0,
            },
        };
        for (const course of studentCourses) {
            for (const courseCode of sshCourses) {
                if (course["courseCode"] === courseCode &&
                    !exports.disallowedGrades.includes(course["grade"]) &&
                    !coursesTaken.has(course["courseCode"])) {
                    let courseEntry = {
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
        if ((credits >= 12 && branch != "CSD") ||
            (branch == "CSD" && credits >= 16)) {
            returnData.isCompleteBool = true;
            returnData.isCompleteText = "Complete";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.cwRule = {
    ruleId: 3,
    checkRule: (studentCourseData, context) => {
        const cwCourses = database_1.courseDatabase["CW Course"];
        const studentCourses = studentCourseData["courses"];
        let credits = 0;
        let returnData = {
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
                    let courseEntry = {
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
        }
        else if (credits > 2) {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Done extra credits";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.sgRule = {
    ruleId: 4,
    checkRule: (studentCourseData, context) => {
        const sgCourses = database_1.courseDatabase["SG Course"];
        const studentCourses = studentCourseData["courses"];
        let coursesTaken = new Map();
        let credits = 0;
        let returnData = {
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
                    let courseEntry = {
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
        }
        else if (credits > 2) {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Done extra credits";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.thirtyTwoCreditsRule = {
    ruleId: 5,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: false,
            isCompleteText: "Incomplete",
            data: {
                totalCredits: 0,
                courseData: [],
            },
        };
        context = context ? context : "CSE";
        const coreCourses = database_1.courseDatabase[context];
        let major = "CSE"; // Default major is CSE other option in ECE
        let extraCoursesMajor = database_1.courseDatabase["CSE 32"];
        let extraCoursesBranch = [];
        if (context === "ECE") {
            major = "ECE";
            extraCoursesMajor = database_1.courseDatabase["ECE 32"];
            extraCoursesBranch = database_1.courseDatabase["ECE 32"];
        }
        let branch = context; // Default branch is CSE other options are BIO, DES, MTH
        if (context === "CSB") {
            branch = "BIO";
        }
        else if (context === "CSD") {
            branch = "DES";
        }
        else if (context === "CSAM") {
            branch = "MTH";
            extraCoursesBranch = database_1.courseDatabase["CSAM 32"];
        }
        else if (context === "CSAI") {
            branch = "CSE";
        }
        const studentCourses = studentCourseData["courses"];
        let majorCredits = 0;
        let contextBranchCredits = 0;
        let coursesTaken = new Map();
        for (const course of studentCourses) {
            // Doesn't check for a 2xx coursec
            // Doesn't check for courses that were Incomplete in the last four semesters.
            if (course["courseCode"].startsWith(major + "1") ||
                course["courseCode"].startsWith(branch + "1") ||
                course["courseCode"].startsWith(major + "2") ||
                course["courseCode"].startsWith(branch + "2") ||
                course["semester"] < "5" ||
                course["semester"].toString().startsWith("Summer Term")) {
                continue;
            }
            // Checks if the course has a valid grade against it and is a CSE course.
            if (!exports.disallowedGrades.includes(course["grade"]) &&
                !coursesTaken.has(course["courseCode"]) &&
                course["includedInMinors"].length < 3 &&
                (course["courseCode"].startsWith(major) ||
                    course["courseCode"].startsWith(branch) ||
                    extraCoursesMajor.includes(course["courseCode"]) ||
                    extraCoursesBranch.includes(course["courseCode"]))) {
                let courseEntry = {
                    course: course["courseCode"],
                    courseName: course["course"],
                    semester: course["semester"],
                    status: "Complete",
                    credits: course["credit"],
                    grade: course["grade"],
                };
                if (course["courseCode"].startsWith(major) ||
                    extraCoursesMajor.includes(course["courseCode"])) {
                    majorCredits += course["credit"];
                }
                else if (course["courseCode"].startsWith(branch) ||
                    extraCoursesBranch.includes(course["courseCode"])) {
                    contextBranchCredits += course["credit"];
                }
                coursesTaken.set(course["courseCode"], course["credit"]);
                returnData.data.courseData.push(courseEntry);
            }
        }
        let onlineCourseData = exports.onlineCoursesRule.checkRule(studentCourseData, context);
        for (let course of onlineCourseData.data.courses) {
            if (course["course"].startsWith(branch) ||
                course["course"].startsWith(major)) {
                let courseEntry = {
                    course: course["course"],
                    courseName: course["course"],
                    semester: course["semester"],
                    status: "Complete",
                    credits: course["credits"],
                    grade: course["grade"],
                };
                if (course["course"].startsWith(major)) {
                    majorCredits += Number(course["credits"]);
                }
                else {
                    contextBranchCredits += Number(course["credits"]);
                }
                returnData.data.courseData.push(courseEntry);
            }
        }
        if (majorCredits + contextBranchCredits >= 32 &&
            majorCredits >= 12 &&
            (context === major || contextBranchCredits >= 12)) {
            returnData.isCompleteBool = true;
            returnData.isCompleteText = "Complete";
        }
        if (context === "CSSS" && majorCredits + contextBranchCredits >= 16) {
            returnData.isCompleteBool = true;
            returnData.isCompleteText = "Complete";
        }
        returnData.data.totalCredits = majorCredits + contextBranchCredits;
        return returnData;
    },
};
exports.ipRule = {
    ruleId: 6,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Not Done",
            data: {
                totalCredits: 0,
                courses: [],
            },
        };
        const ipCourses = database_1.courseDatabase["IP/IS/UR"];
        const studentCourses = studentCourseData["courses"];
        let credits = 0;
        for (const course of studentCourses) {
            const courseCodeIp = course["courseCode"].substring(0, 3);
            for (const courseCode of ipCourses) {
                if (courseCodeIp === courseCode &&
                    !exports.disallowedGrades.includes(course["grade"])) {
                    let courseEntry = {
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
        }
        else {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Done extra credits";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.onlineCoursesRule = {
    ruleId: 7,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Not Done",
            data: {
                totalCredits: 0,
                courses: [],
            },
        };
        const onlineCourses = database_1.courseDatabase["Online course"];
        const studentCourses = studentCourseData["courses"];
        let credits = 0;
        for (const course of studentCourses) {
            for (const courseCode of onlineCourses) {
                if (course["courseCode"] === courseCode && course["grade"] == "S") {
                    let courseEntry = {
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
        else if (credits <= 8) {
            returnData.isCompleteText = "Complete";
        }
        else {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Done extra credits";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.twoxxRule = {
    ruleId: 8,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Not Done",
            data: {
                totalCredits: 0,
                courses: [],
            },
        };
        context = context ? context : "CSE";
        const bucketName = context + " bucket";
        const coreCourses = database_1.courseDatabase[context];
        const studentCourses = studentCourseData["courses"];
        const mandatoryBuckets = [];
        let credits = 0;
        for (const key of Object.keys(database_1.courseDatabase)) {
            if (key.startsWith(bucketName)) {
                mandatoryBuckets.push(database_1.courseDatabase[key]);
            }
        }
        const mandatoryBucketCourses = [];
        for (const courseBucket of mandatoryBuckets) {
            for (const course of courseBucket) {
                mandatoryBucketCourses.push(course);
            }
        }
        for (const course of studentCourses) {
            if (course["courseCode"].substring(3, 4) === "2" &&
                !exports.disallowedGrades.includes(course["grade"]) &&
                ((course["semester"] >= "5" &&
                    !course["semester"].toString().startsWith("Summer")) ||
                    course["semester"] >= "Summer Term 3") &&
                !database_1.courseDatabase["SSH Courses"].includes(course["courseCode"]) &&
                !coreCourses.includes(course["courseCode"]) &&
                !mandatoryBucketCourses.includes(course["courseCode"])) {
                let courseEntry = {
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
        }
        else if (credits <= 8) {
            returnData.isCompleteText = "Complete";
        }
        else {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Done extra credits";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.btpRule = {
    ruleId: 9,
    checkRule: (studentCourseData, context) => {
        let returnData = {
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
        let btpSemsToInclude = 0;
        for (const course of studentCourses) {
            const courseCodebtp = course["courseCode"].substring(0, 3);
            if (courseCodebtp === "BTP" &&
                !exports.disallowedGrades.includes(course["grade"])) {
                credits += course["credit"];
                sem.push(course["semester"]);
                returnData.data.courses.push({
                    course: course["courseCode"],
                    courseName: course["course"],
                    semester: course["semester"],
                    status: "Complete",
                    credits: course["credit"],
                    grade: course["grade"],
                });
                if (course["includedInMinors"] === "BTP") {
                    btpSemsToInclude += 1;
                }
            }
        }
        returnData.data.totalCredits = credits;
        if (credits == 0) {
            returnData.isCompleteText = "Not Done";
        }
        else if (credits > 0 && credits < 8) {
            returnData.isCompleteText = "Incomplete";
        }
        else if (credits > 12) {
            returnData.isCompleteText = "Done extra credits";
        }
        else if (credits >= 8) {
            let semesters = [];
            let pairDifferences = [];
            for (let i = 0; i < sem.length; i++) {
                const num1 = parseFloat(sem[i]);
                if (!isNaN(num1)) {
                    semesters.push(num1);
                }
            }
            if (semesters.length == 1) {
                returnData.isCompleteText = "Incomplete"; // 8 in 1 or 4 in 1 and 4 in summer
                return returnData;
            }
            semesters.sort();
            for (let i = 0; i < semesters.length - 1; i++) {
                const num1 = semesters[i];
                const num2 = semesters[i + 1];
                const difference = Math.abs(num1 - num2);
                pairDifferences.push(difference);
            }
            const allOnes = pairDifferences.every((element) => element === 1);
            if (allOnes && credits <= 12) {
                returnData.isCompleteText = "Complete";
            }
            else if (!allOnes && credits <= 12) {
                returnData.isCompleteText = "Incomplete";
                const countNonOnes = pairDifferences.filter((element) => element !== 1).length;
                if (btpSemsToInclude === countNonOnes) {
                    returnData.isCompleteText = "Complete";
                }
            }
        }
        return returnData;
    },
};
exports.incompleteGradeRule = {
    ruleId: 10,
    checkRule: (studentCourseData, context) => {
        let returnData = {
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
                let courseEntry = {
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
exports.required156CreditsRule = {
    ruleId: 11,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: false,
            isCompleteText: "Incomplete",
            data: 0,
        };
        const avoidCourses = ["BIP", "BIS", "BUR", "MSC", "BTA", "BTP"];
        const onlineCourses = database_1.courseDatabase["Online course"];
        const disallowedGrades = ["F", "I", "W", "X"];
        let credits = 0;
        let coursesTaken = new Map();
        for (const course of studentCourseData["courses"]) {
            if (!coursesTaken.has(course["courseCode"]) &&
                !disallowedGrades.includes(course["grade"]) &&
                !avoidCourses.includes(course["courseCode"].slice(0, 3)) &&
                !onlineCourses.includes(course["courseCode"])) {
                coursesTaken.set(course["courseCode"], course["credit"]);
                credits += course["credit"];
            }
        }
        credits += Math.min(exports.cwRule.checkRule(studentCourseData, context).data.totalCredits, 2);
        credits += Math.min(exports.sgRule.checkRule(studentCourseData, context).data.totalCredits, 2);
        credits += Math.min(exports.ipRule.checkRule(studentCourseData, context).data.totalCredits, 8);
        const btpReturnData = exports.btpRule.checkRule(studentCourseData, context);
        if (btpReturnData.isCompleteText === "Complete" ||
            btpReturnData.isCompleteText === "Done extra credits") {
            credits += Math.min(btpReturnData.data.totalCredits, 12);
        }
        credits += Math.min(exports.onlineCoursesRule.checkRule(studentCourseData, context).data.totalCredits, 8);
        returnData.data = credits;
        if (credits >= 156) {
            returnData.isCompleteBool = true;
            returnData.isCompleteText = "Complete";
            returnData.data = credits;
        }
        return returnData;
    },
};
exports.csaiCseCoreRule = {
    ruleId: 12,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Complete",
            data: {
                totalCredits: 0,
                courses: [],
            },
        };
        const studentCourses = studentCourseData["courses"];
        const csaiCseCore = database_1.courseDatabase["CSAI CSE CORE"];
        let csaiCseCoreCredits = 8;
        let credits = 0;
        for (const course of csaiCseCore) {
            let options = [];
            if (course.length > 6) {
                const splitOptions = course.split("/");
                options.push(...splitOptions);
            }
            for (const studentCourse of studentCourses) {
                if ((studentCourse["courseCode"] === course ||
                    (options.length > 0 &&
                        options.includes(studentCourse["courseCode"]))) &&
                    !exports.disallowedGrades.includes(studentCourse["grade"])) {
                    let courseEntry = {
                        course: studentCourse["courseCode"],
                        courseName: studentCourse["course"],
                        semester: studentCourse["semester"],
                        status: "Complete",
                        credits: studentCourse["credit"],
                        grade: studentCourse["grade"],
                    };
                    returnData.data.courses.push(courseEntry);
                    credits += studentCourse["credit"];
                    csaiCseCoreCredits -= studentCourse["credit"];
                }
            }
        }
        if (csaiCseCoreCredits > 0) {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Incomplete";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.csaiCoreRule = {
    ruleId: 13,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Complete",
            data: {
                totalCredits: 0,
                courses: [],
            },
        };
        const studentCourses = studentCourseData["courses"];
        const csaiCore = database_1.courseDatabase["AI CORE"];
        let csaiCoreCredits = 8;
        let credits = 0;
        for (const course of csaiCore) {
            let options = [];
            if (course.length > 6) {
                const splitOptions = course.split("/");
                options.push(...splitOptions);
            }
            for (const studentCourse of studentCourses) {
                if ((studentCourse["courseCode"] === course ||
                    (options.length > 0 &&
                        options.includes(studentCourse["courseCode"]))) &&
                    !exports.disallowedGrades.includes(studentCourse["grade"])) {
                    let courseEntry = {
                        course: studentCourse["courseCode"],
                        courseName: studentCourse["course"],
                        semester: studentCourse["semester"],
                        status: "Complete",
                        credits: studentCourse["credit"],
                        grade: studentCourse["grade"],
                    };
                    returnData.data.courses.push(courseEntry);
                    credits += studentCourse["credit"];
                    csaiCoreCredits -= studentCourse["credit"];
                }
            }
        }
        if (csaiCoreCredits > 0) {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Incomplete";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.csaiApplicationRule = {
    ruleId: 14,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Complete",
            data: {
                totalCredits: 0,
                courses: [],
            },
        };
        const studentCourses = studentCourseData["courses"];
        const csaiApplication = database_1.courseDatabase["AI APPLICATION"];
        let csaiApplicationCredits = 16;
        let credits = 0;
        for (const course of csaiApplication) {
            let options = [];
            if (course.length > 6) {
                const splitOptions = course.split("/");
                options.push(...splitOptions);
            }
            for (const studentCourse of studentCourses) {
                if ((studentCourse["courseCode"] === course ||
                    (options.length > 0 &&
                        options.includes(studentCourse["courseCode"]))) &&
                    (!exports.disallowedGrades.includes(studentCourse["grade"]) || studentCourse["grade"] == 'S')) {
                    let courseEntry = {
                        course: studentCourse["courseCode"],
                        courseName: studentCourse["course"],
                        semester: studentCourse["semester"],
                        status: "Complete",
                        credits: studentCourse["credit"],
                        grade: studentCourse["grade"],
                    };
                    returnData.data.courses.push(courseEntry);
                    credits += studentCourse["credit"];
                    csaiApplicationCredits -= studentCourse["credit"];
                }
            }
        }
        if (csaiApplicationCredits > 0) {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Incomplete";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.csaiMathsCoreRule = {
    ruleId: 15,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Complete",
            data: {
                totalCredits: 0,
                courses: [],
            },
        };
        const studentCourses = studentCourseData["courses"];
        const csaiMathCore = database_1.courseDatabase["CSAI MATH CORE"];
        let csaiMathCredits = 4;
        let credits = 0;
        for (const course of csaiMathCore) {
            let options = [];
            if (course.length > 6) {
                const splitOptions = course.split("/");
                options.push(...splitOptions);
            }
            for (const studentCourse of studentCourses) {
                if ((studentCourse["courseCode"] === course ||
                    (options.length > 0 &&
                        options.includes(studentCourse["courseCode"]))) &&
                    !exports.disallowedGrades.includes(studentCourse["grade"])) {
                    let courseEntry = {
                        course: studentCourse["courseCode"],
                        courseName: studentCourse["course"],
                        semester: studentCourse["semester"],
                        status: "Complete",
                        credits: studentCourse["credit"],
                        grade: studentCourse["grade"],
                    };
                    returnData.data.courses.push(courseEntry);
                    credits += studentCourse["credit"];
                    csaiMathCredits -= studentCourse["credit"];
                }
            }
        }
        if (csaiMathCredits > 0) {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Incomplete";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.ecoMajorCore = {
    ruleId: 16,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Complete",
            data: {
                totalCredits: 0,
                courses: [],
            },
        };
        let credits = 0;
        const ecoMajor = database_1.courseDatabase["ECO CORE"];
        const studentCourses = studentCourseData["courses"];
        for (const course of ecoMajor) {
            let options = [];
            if (course.length > 6) {
                const splitOptions = course.split("/");
                options.push(...splitOptions);
            }
            let courseEntry = {
                course: course,
                courseName: "",
                semester: "",
                status: "Incomplete",
                credits: 0,
                grade: "",
            };
            for (const studentCourse of studentCourses) {
                if ((studentCourse["courseCode"] === course ||
                    (options.length > 0 &&
                        options.includes(studentCourse["courseCode"]))) &&
                    !exports.disallowedGrades.includes(studentCourse["grade"])) {
                    courseEntry.status = "Complete";
                    courseEntry.credits = studentCourse["credit"];
                    courseEntry.semester = studentCourse["semester"];
                    courseEntry.courseName = studentCourse["course"];
                    courseEntry.grade = studentCourse["grade"];
                    credits += studentCourse["credit"];
                }
            }
            returnData.data.courses.push(courseEntry);
        }
        if (credits < 16) {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Incomplete";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.ecoMajorElective = {
    ruleId: 17,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Complete",
            data: {
                totalCredits: 0,
                courses: [],
            },
        };
        let credits = 0;
        const ecoMajor = database_1.courseDatabase["ECO ELECTIVE"];
        const studentCourses = studentCourseData["courses"];
        for (const course of ecoMajor) {
            let options = [];
            if (course.length > 6) {
                const splitOptions = course.split("/");
                options.push(...splitOptions);
            }
            for (const studentCourse of studentCourses) {
                if ((studentCourse["courseCode"] === course ||
                    (options.length > 0 &&
                        options.includes(studentCourse["courseCode"]))) &&
                    !exports.disallowedGrades.includes(studentCourse["grade"])) {
                    let courseEntry = {
                        course: course,
                        courseName: studentCourse["course"],
                        semester: studentCourse["semester"],
                        status: "Complete",
                        credits: studentCourse["credit"],
                        grade: studentCourse["grade"],
                    };
                    credits += studentCourse["credit"];
                    returnData.data.courses.push(courseEntry);
                }
            }
        }
        if (credits < 16) {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Incomplete";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.sshMajor = {
    ruleId: 19,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Complete",
            data: {
                totalCredits: 0,
                courses: [],
            },
        };
        let credits = 0;
        const sshMajor = database_1.courseDatabase["SSH Courses"];
        const studentCourses = studentCourseData["courses"];
        const coreCourses = database_1.courseDatabase["CSSS"];
        for (const course of sshMajor) {
            for (const studentCourse of studentCourses) {
                if (studentCourse["courseCode"] === course &&
                    !coreCourses.includes(course) &&
                    !exports.disallowedGrades.includes(studentCourse["grade"]) &&
                    studentCourse["semester"] >= "5" &&
                    !studentCourse["semester"].toString().startsWith("Summer Term") &&
                    Number(studentCourse["courseCode"].charAt(3)) >= 3) {
                    let courseEntry = {
                        course: course,
                        courseName: studentCourse["course"],
                        semester: studentCourse["semester"],
                        status: "Complete",
                        credits: studentCourse["credit"],
                        grade: studentCourse["grade"],
                    };
                    credits += studentCourse["credit"];
                    returnData.data.courses.push(courseEntry);
                }
            }
        }
        if (credits < 28) {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Not Done";
        }
        returnData.data.totalCredits = credits;
        return returnData;
    },
};
exports.combinesCsssRule = {
    ruleId: 20,
    checkRule: (studentCourseData, context) => {
        let returnData = {
            isCompleteBool: true,
            isCompleteText: "Complete",
            data: {
                totalCredits: 0,
                courses: [],
            },
        };
        const ecoMajorCoreRule = exports.ecoMajorCore.checkRule(studentCourseData, context);
        const ecoMajorElectiveRule = exports.ecoMajorElective.checkRule(studentCourseData, context);
        const sshMajorRule = exports.sshMajor.checkRule(studentCourseData, context);
        if ((!ecoMajorCoreRule.isCompleteBool ||
            !ecoMajorElectiveRule.isCompleteBool) &&
            !sshMajorRule.isCompleteBool) {
            returnData.isCompleteBool = false;
            returnData.isCompleteText = "Incomplete";
        }
        return returnData;
    },
};
exports.allRules = [
    exports.mandatoryCoreRule,
    exports.mandatoryBucketRule,
    exports.sshRule,
    exports.cwRule,
    exports.sgRule,
    exports.thirtyTwoCreditsRule,
    exports.ipRule,
    exports.onlineCoursesRule,
    exports.twoxxRule,
    exports.btpRule,
    exports.incompleteGradeRule,
    exports.required156CreditsRule,
    exports.csaiCseCoreRule,
    exports.csaiCoreRule,
    exports.csaiApplicationRule,
    exports.csaiMathsCoreRule,
    exports.ecoMajorCore,
    exports.ecoMajorElective,
    exports.sshMajor,
    exports.combinesCsssRule,
];
