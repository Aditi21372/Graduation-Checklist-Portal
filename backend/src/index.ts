import { getCourseDatabase } from "./database";
import { CourseMap } from "./type";

import {
  mandatoryCoreRule,
  mandatoryBucketRule,
  sshRule,
  cwRule,
  sgRule,
  thirtyTwoCreditsRule,
  ipRule,
  onlineCoursesRule,
  twoxxRule,
  btpRule,
  incompleteGradeRule,
  required156CreditsRule,
} from "./rule";

export const courseListFilePath = "src/data/Course_Codes.xlsm";

export const courseDatabase: CourseMap = getCourseDatabase(courseListFilePath);

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
export const allRules = [
  mandatoryCoreRule,
  mandatoryBucketRule,
  sshRule,
  cwRule,
  sgRule,
  thirtyTwoCreditsRule,
  ipRule,
  onlineCoursesRule,
  twoxxRule,
  btpRule,
  incompleteGradeRule,
  required156CreditsRule,
];
