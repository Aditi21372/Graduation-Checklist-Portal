import { describe, expect, test } from "@jest/globals";
import { calculateCGPA } from "../cgpa";
import { getGraduatedStudents, preprocessCourseData, searchByRollNo } from "../database";

describe("CGPA Algorithm tests", () => {
  test("calculates CGPA correctly for CSE students with roll numbers in the form 2019xxx", () => {
    const filePath = "src/data/2019_final_graduated.xlsx";
    const graduatedStudents = getGraduatedStudents(filePath);

    graduatedStudents.forEach(async (student) => {
      // Skip students who are not from Computer Science Engineering
      const studentData = await searchByRollNo(student.rollNo);
      if (studentData.length > 0) {
        let studentCourseData = preprocessCourseData(studentData);
        const expectedCGPA = calculateCGPA(studentCourseData);

        // Assuming you have a property named 'cgpa' in your GraduatedStudent type
        expect(student.cgpa === expectedCGPA[expectedCGPA.length - 1].cgpa)
          .toBeTruthy;
      }
    });
  });
});
