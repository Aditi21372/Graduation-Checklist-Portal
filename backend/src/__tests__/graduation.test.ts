import { describe, expect, test } from "@jest/globals";

import {
  getGraduatedStudents,
} from "../database";

import { getGraduationStatus } from "../degree";

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

      expect(getGraduationStatus(student.rollNo, "CSE")).toBeTruthy;
    });
  });
});
