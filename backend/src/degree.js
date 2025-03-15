"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGraduationDate = exports.getGraduationStatus = void 0;
const rule_1 = require("./rule");
const semesters = [
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
const graduationRulesCsai = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const graduationRulesCsss = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 20];
function getGraduationStatus(studentCourseData, branch) {
    let isGraduated = true;
    let graduationRulesBranch = graduationRules;
    if (branch === "CSAI") {
        graduationRulesBranch = graduationRulesCsai;
    }
    else if (branch === "CSSS") {
        graduationRulesBranch = graduationRulesCsss;
    }
    for (let rule of rule_1.allRules) {
        if (graduationRulesBranch.includes(rule.ruleId)) {
            if (rule.ruleId === 9) {
                const status = rule.checkRule(studentCourseData, branch).isCompleteText;
                if (status === "Incomplete" || status === "Done extra credits") {
                    isGraduated = false;
                    continue;
                }
            }
            if (!rule.checkRule(studentCourseData, branch).isCompleteBool) {
                isGraduated = false;
            }
        }
    }
    return isGraduated;
}
exports.getGraduationStatus = getGraduationStatus;
function getGraduationDate(studentCourseData, branch) {
    const isGraduated = getGraduationStatus(studentCourseData, branch);
    const studentCourses = studentCourseData["courses"];
    let maxSem = 0;
    for (let course of studentCourses) {
        let semester = course["semester"].toString();
        if (semesters.includes(semester)) {
            const semesterIndex = semesters.indexOf(semester); // Add type assertion
            if (semesterIndex > maxSem && course['grade'] != 'Withdrawn') {
                maxSem = semesterIndex;
            }
        }
    }
    if (isGraduated) {
        if (maxSem === 10)
            return "June 21, " + (studentCourseData["batch"] + 4);
        else if (maxSem === 11)
            return "September 21, " + (studentCourseData["batch"] + 4);
        else if (maxSem === 12)
            return "January 21, " + (studentCourseData["batch"] + 5);
    }
    return "Not Graduated";
}
exports.getGraduationDate = getGraduationDate;
