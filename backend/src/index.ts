import { calculateCGPA } from "./cgpa";
import {
  DatabaseMap,
  getStudentDatabase,
  StudentInfo,
  CourseMap,
  getCourseDatabase,
} from "./database";

import {
  sshRule,
  cwRule,
  sgRule,
  btpRule,
  mandatoryCoreRule,
  mandatoryBucketRule,
  twoxxRule,
  required156CreditsRule,
  ipRule,
  onlineCoursesRule,
  thirtyTwoCreditsRule,
} from "./rule";

export const studentRecordsFilePath = "src/data/Student_Database_2019.xlsm";
export const courseListFilePath = "src/data/Course_Codes.xlsm";

export const courseDatabase: CourseMap = getCourseDatabase(courseListFilePath);
export const studentDatabase: DatabaseMap = getStudentDatabase(
  studentRecordsFilePath
);

export const gradeHierarchy = [
  "A+",
  "A",
  "A-",
  "B",
  "B-",
  "C",
  "C-",
  "D",
  "I",
  "S",
  "W",
  "F",
  "X",
  "",
];

export const disallowedGrades = ["I", "S", "W", "F", "X"];
export const rollNumber = 2019032;
export const allRules = [
  sshRule,
  cwRule,
  sgRule,
  btpRule,
  mandatoryCoreRule,
  mandatoryBucketRule,
  twoxxRule,
  required156CreditsRule,
  ipRule,
  onlineCoursesRule,
  thirtyTwoCreditsRule,
];

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
  ecoMajor: string;
  btp: string;
  credits: number;
  cgpa: number;
};

export function findCGPA(studentCourseData: StudentInfo) {
  return calculateCGPA(studentCourseData);
}
