import { describe, expect, test } from "@jest/globals";

import { getGraduatedStudents, preprocessCourseData, searchByRollNo } from "../database";

import { getGraduationStatus } from "../degree";

describe("Graduation Algorithm tests", () => {
  test("All graduation positive cases are correct", () => {
    const filePath = "src/data/2019_final_graduated.xlsx";
    const graduatedStudents = getGraduatedStudents(filePath);

    graduatedStudents.forEach((student) => {
      // Skip students who are not from Computer Science Engineering
      let branch = "";
      if (student.program === "Computer Science and Engineering") {
        branch = "CSE";
      }
      else if (student.program === "Electronics and Communication Engineering") {
        branch = "ECE";
      }
      else if(student.program === "Computer Science and Applied Mathematics") {
        branch = "CSAM";
      }
      else if(student.program === "Computer Science and Design") {
        branch = "CSD";
      }
      else if(student.program === "Computer Science and Biosciences") {
        branch = "CSB";
      }
      else if(student.program === "Computer Science and Social Sciences") {
        branch = "CSSS";
        return;
      }
      else if(student.program === "Computer Science and Artificial Intelligence") {
        branch = "CSAI";
        return;
      }

      const processStudentData = async () => {
        const studentData = await searchByRollNo(student.rollNo);
        if (studentData.length > 0) {
          let studentCourseData = preprocessCourseData(studentData);
          expect(getGraduationStatus(studentCourseData, branch)).toBeTruthy;
        }
      };

      processStudentData();
    });
  });
});
