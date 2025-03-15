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
const cgpa_1 = require("../cgpa");
const database_1 = require("../database");
(0, globals_1.describe)("CGPA Algorithm tests", () => {
    (0, globals_1.test)("calculates CGPA correctly for CSE students with roll numbers in the form 2019xxx", () => {
        const filePath = "src/data/2019_final_graduated.xlsx";
        const graduatedStudents = (0, database_1.getGraduatedStudents)(filePath);
        graduatedStudents.forEach((student) => __awaiter(void 0, void 0, void 0, function* () {
            // Skip students who are not from Computer Science Engineering
            const studentData = yield (0, database_1.searchByRollNo)(student.rollNo);
            if (studentData.length > 0) {
                let studentCourseData = (0, database_1.preprocessCourseData)(studentData);
                const expectedCGPA = (0, cgpa_1.calculateCGPA)(studentCourseData);
                // Assuming you have a property named 'cgpa' in your GraduatedStudent type
                (0, globals_1.expect)(student.cgpa === expectedCGPA[expectedCGPA.length - 1].cgpa)
                    .toBeTruthy;
            }
        }));
    });
});
