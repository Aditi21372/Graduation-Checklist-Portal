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
const globals_1 = require("@jest/globals");
const database_1 = require("../database");
const degree_1 = require("../degree");
(0, globals_1.describe)("Graduation Algorithm tests", () => {
    (0, globals_1.test)("All graduation positive cases are correct", () => {
        const filePath = "src/data/2019_final_graduated.xlsx";
        const graduatedStudents = (0, database_1.getGraduatedStudents)(filePath);
        graduatedStudents.forEach((student) => {
            // Skip students who are not from Computer Science Engineering
            let branch = "";
            if (student.program === "Computer Science and Engineering") {
                branch = "CSE";
            }
            else if (student.program === "Electronics and Communication Engineering") {
                branch = "ECE";
            }
            else if (student.program === "Computer Science and Applied Mathematics") {
                branch = "CSAM";
            }
            else if (student.program === "Computer Science and Design") {
                branch = "CSD";
            }
            else if (student.program === "Computer Science and Biosciences") {
                branch = "CSB";
            }
            else if (student.program === "Computer Science and Social Sciences") {
                branch = "CSSS";
                return;
            }
            else if (student.program === "Computer Science and Artificial Intelligence") {
                branch = "CSAI";
                return;
            }
            const processStudentData = () => __awaiter(void 0, void 0, void 0, function* () {
                const studentData = yield (0, database_1.searchByRollNo)(student.rollNo);
                if (studentData.length > 0) {
                    let studentCourseData = (0, database_1.preprocessCourseData)(studentData);
                    (0, globals_1.expect)((0, degree_1.getGraduationStatus)(studentCourseData, branch)).toBeTruthy;
                }
            });
            processStudentData();
        });
    });
});
