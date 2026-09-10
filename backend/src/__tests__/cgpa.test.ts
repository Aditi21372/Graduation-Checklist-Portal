import { describe, expect, test } from "@jest/globals";
import { calculateCGPA } from "../cgpa";
import { StudentInfo } from "../type";

function makeStudent(
  courses: {
    courseCode: string;
    grade: "A+" | "A" | "A-" | "B" | "B-" | "C" | "C-" | "D" | "F" | "S" | "I" | "W" | "X" | "Withdrawn";
    semester: string;
    credit: 1 | 2 | 4 | 8 | 12;
  }[]
): StudentInfo {
  return {
    studentName: "Test Student",
    rollNumber: 2026001,
    program: "Computer Science and Engineering",
    batch: 2022,
    courses: courses.map((c) => ({ ...c, course: c.courseCode, includedInMinors: "No" as const })),
  };
}

describe("calculateCGPA (pure algorithm, no DB)", () => {
  test("computes SGPA and cumulative CGPA across two semesters", () => {
    const student = makeStudent([
      { courseCode: "CSE101", grade: "A", semester: "1", credit: 4 },
      { courseCode: "MTH100", grade: "B", semester: "1", credit: 4 },
      { courseCode: "CSE102", grade: "A-", semester: "2", credit: 4 },
      { courseCode: "ECE111", grade: "B", semester: "2", credit: 4 },
    ]);

    const result = calculateCGPA(student);

    // Semester 1: (10*4 + 8*4) / 8 = 9.00
    expect(result[0].sgpa).toBe(9);
    expect(result[0].cgpa).toBe(9);

    // Semester 2: (9*4 + 8*4) / 8 = 8.50, cumulative 140/16 = 8.75
    expect(result[1].sgpa).toBe(8.5);
    expect(result[1].cgpa).toBe(8.75);
  });

  test("a repeated course uses the improved grade for CGPA", () => {
    const student = makeStudent([
      { courseCode: "CSE101", grade: "D", semester: "1", credit: 2 },
      { courseCode: "CSE102", grade: "A", semester: "2", credit: 2 },
      { courseCode: "CSE101", grade: "B", semester: "2", credit: 2 },
    ]);

    const result = calculateCGPA(student);

    // Sem 1: (4*2)/2 = 4.00, CGPA 4.00
    expect(result[0].sgpa).toBe(4);
    expect(result[0].cgpa).toBe(4);

    // Sem 2: repeated D replaced by B; SGPA = (10*2 + 8*2)/(2 + 2 repeated) = 9.00,
    // cumulative grades = 10*2 + 8*2 = 36, cumulative credits = 2 + 2 = 4 -> 9.00
    expect(result[1].sgpa).toBe(9);
    expect(result[1].cgpa).toBe(9);
  });

  test("F credits count toward SGPA but not CGPA", () => {
    const student = makeStudent([
      { courseCode: "CSE101", grade: "F", semester: "1", credit: 4 },
      { courseCode: "MTH100", grade: "A", semester: "1", credit: 4 },
    ]);

    const result = calculateCGPA(student);

    // SGPA: (2*4 + 10*4)/8 = 6.00, CGPA excludes failed credits: (48 - 2*4)/4 = 10.00
    expect(result[0].sgpa).toBe(6);
    expect(result[0].cgpa).toBe(10);
  });

  test("disallowed grades (I/W/X) are excluded entirely", () => {
    const student = makeStudent([
      { courseCode: "CSE101", grade: "A", semester: "1", credit: 4 },
      { courseCode: "HUM201", grade: "W", semester: "1", credit: 2 },
    ]);

    const result = calculateCGPA(student);

    expect(result[0].sgpa).toBe(10);
    expect(result[0].cgpa).toBe(10);
  });
});
