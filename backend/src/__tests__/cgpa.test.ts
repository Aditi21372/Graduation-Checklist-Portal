import { describe, expect, test } from "@jest/globals";
import { calculateCGPA } from "../cgpa";
import { getGraduatedStudents } from "../database";
import { studentDatabase } from "../index";

describe("CGPA Algorithm tests", () => {
  test("calculates CGPA correctly for CSE students with roll numbers in the form 2019xxx", () => {
    const filePath = "src/data/2019_final_graduated.xlsx";
    const graduatedStudents = getGraduatedStudents(filePath);

    const incorrect_cgpa: number[] = [];
    const correct_cgpa: number[] = [];

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

      // console.log("Student: ", student.rollNo);

      const expectedCGPA = calculateCGPA(studentDatabase[student.rollNo]);

      // console.log(
      //   "Expected CGPA: ",
      //   expectedCGPA[expectedCGPA.length - 1].cgpa
      // );

      if (student.cgpa !== expectedCGPA[expectedCGPA.length - 1].cgpa) {
        incorrect_cgpa.push(student.rollNo);
      } else {
        correct_cgpa.push(student.rollNo);
      }

      // Assuming you have a property named 'cgpa' in your GraduatedStudent type
      expect(
        student.cgpa - expectedCGPA[expectedCGPA.length - 1].cgpa
      ).toBeLessThan(0.3);
    });

    // console.log("Incorrect CGPA: ", incorrect_cgpa);
    // console.log("Correct CGPA: ", correct_cgpa);
  });
});
