export interface IDegree {
  name: string;
  degreeType: "BTECH" | "MTECH" | "PHD";
  minors: string[];
  graduationRules: IRule[];
}

export interface IRule {
  ruleId: string;
  checkRule: (rollNumber: number, degree: IDegree) => Boolean;
}

export interface IStudentCourse {
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
  semster: number;
  credit: 1 | 2 | 4 | 8 | 12;
}
