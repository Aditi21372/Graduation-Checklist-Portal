export type Grade = { semester: string; sgpa: number; cgpa: number };
export type Course = {
  grade: number;
  credit: number;
};

export type CreditGroups = { [key: number]: number };
export type GradeMap = { [grade: string]: number };

export type StudentCourse = {
  courseCode: string;
  course: string;
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
    | "X"
    | "Withdrawn";
  semester: string;
  credit: 1 | 2 | 4 | 8 | 12;
  includedInMinors: string;
};

export type StudentInfo = {
  studentName: string;
  rollNumber: number;
  program: string;
  batch: number;
  courses: StudentCourse[];
};

// Clubs multiple course codes under a category.
// For example,
// CourseMap["SSH"] = ["ECO101", "ECO102",]
export type CourseMap = {
  [key: string]: string[];
};

export type RuleEntry = {
  rule: string;
  value: "";
  status: "No" | "Yes";
};

export type RuleData = {
  isCompleteBool: boolean;
  isCompleteText:
    | "Done"
    | "Not Done"
    | "Complete"
    | "Done extra credits"
    | "Incomplete";
  data: any;
};

export type MinorsComponents = {
  isCompleteBool: boolean;
  isCompleteText:
    | "Done"
    | "Not Done"
    | "Complete"
    | "Done extra credits"
    | "Incomplete";
  data: any;
  totalCredits: number;
};

export type GraduatedStudent = {
  sNo: number;
  programSeq: number;
  rollNo: number;
  name: string;
  program: string;
  graduationDate: string;
  honors: string;
  minorInCB: string;
  minorInEco: string;
  minorInENT: string;
  // This line will be removed minorInQuantum string;
  minorInDesign: string;
  ecoMajor: string;
  btp: string;
  credits: number;
  cgpa: number;
};

export type CourseData = {
  course: string;
  courseName: string;
  semester: string;
  status: string;
  credits: number;
  grade: string;
};
