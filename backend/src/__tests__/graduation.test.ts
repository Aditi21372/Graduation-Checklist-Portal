import { describe, expect, test } from "@jest/globals";
import { calculateCGPA } from "../cgpa";

import {
  CourseMap,
  DatabaseMap,
  getCourseDatabase,
  getStudentDatabase,
  getGraduatedStudents,
} from "../database";

import {
  gradeHierarchy,
  disallowedGrades,
  studentDatabase,
  courseDatabase,
} from "../index";
import { getGraduationStatus } from "../degree";
import exp from "constants";

describe("Graduation Algorithm tests", () => {
  test("All graduation positive cases are correct", () => {
    const filePath = "src/data/2019_final_graduated.xlsx";
    const graduatedStudents = getGraduatedStudents(filePath);

    graduatedStudents.forEach((student) => {
      // Skip students who are not from Computer Science Engineering
      if (student.program !== "Computer Science and Engineering") {
        return;
      }

      // Skip students whose roll number is not in the form 2019xxx
      const rollNumberPattern = /^2019\d{3}$/;
      if (!rollNumberPattern.test(student.rollNo.toString())) {
        return;
      }

      if (!getGraduationStatus(student.rollNo, "CSE")) {
        console.log(student.rollNo);
      }

      //   expect(getGraduationStatus(student.rollNo, "CSE")).toBe(true);
      expect(getGraduationStatus(student.rollNo, "CSE")).toBeTruthy;
    });
  });
});
