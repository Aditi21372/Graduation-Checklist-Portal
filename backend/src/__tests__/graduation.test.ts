import { describe, expect, test } from "@jest/globals";
import { getGraduationStatus } from "../degree";
import { StudentInfo } from "../type";

function makeStudent(
  courses: {
    courseCode: string;
    grade: "A+" | "A" | "A-" | "B" | "B-" | "C" | "C-" | "D" | "F" | "S";
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

describe("getGraduationStatus (pure algorithm, no DB)", () => {
  test("a student with far fewer than 156 credits is not graduated (CSE)", () => {
    const student = makeStudent([
      { courseCode: "CSE101", grade: "A", semester: "1", credit: 4 },
      { courseCode: "MTH100", grade: "B", semester: "2", credit: 4 },
    ]);

    expect(getGraduationStatus(student, "CSE")).toBe(false);
  });

  test("a student with no courses at all is not graduated", () => {
    const student = makeStudent([]);

    expect(getGraduationStatus(student, "CSE")).toBe(false);
  });

  test("an empty transcript is not graduated for every branch", () => {
    const student = makeStudent([]);

    for (const branch of ["CSE", "ECE", "CSAM", "CSD", "CSB", "CSAI", "CSSS"]) {
      expect(getGraduationStatus(student, branch)).toBe(false);
    }
  });
});
