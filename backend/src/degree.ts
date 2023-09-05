import { IRule } from "./rule";

export interface IDegree {
  name: string;
  degreeType: "BTECH" | "MTECH" | "PHD";
  minors: string[];
  graduationRules: IRule[];
  addRule(rule: IRule): void;
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

export class CSEDegree implements IDegree {
  name: string = "CSE";
  degreeType: "BTECH" = "BTECH";
  minors: string[] = ["ECO", "ENT"]; // To be added
  graduationRules: IRule[] = [];

  addRule(rule: IRule) {
    this.graduationRules.push(rule);
  }
}
