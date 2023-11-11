import { allRules } from "./index";
export interface IDegree {
  name: string;
  degreeType: "BTECH" | "MTECH" | "PHD";
  minors: string[];
  graduationRules: number[];
}

export type StudentCourse = {
  courseCode: string;
  grade:
    | "A+"
    | "A"
    | "A-"
    | "B"
    | "B-"
    | "C"
    | "C-"
    | "D"
    | "F"
    | "S"
    | "I"
    | "W"
    | "X";
  semester: string;
  credit: 1 | 2 | 4 | 8 | 12;
};

export const CSEDegree: IDegree = {
  name: "CSE",
  degreeType: "BTECH",
  minors: ["ECO", "ENT"], // To be added
  graduationRules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};

export function getGraduationStatus(
  rollNumber: number,
  branch: string
): Boolean {
  let isGraduated: Boolean = true;
  if (branch === "CSE") {
    let cseRules = CSEDegree.graduationRules;

    for (let rule of allRules) {
      if (rule.ruleId in cseRules) {
        if (!rule.checkRule(rollNumber, branch).isComplete) {
          isGraduated = false;
        }
      }
    }
  }
  return isGraduated;
}
