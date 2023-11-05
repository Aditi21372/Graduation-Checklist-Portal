import { StudentInfo } from "./database";
import { courseDatabase, disallowedGrades } from "./index";
import { calculateCGPA } from "./cgpa";

// Add other BTP codes here
const btpCourses = ["BTP499"];

export function isHonors(
  rollNumber: number,
  studentInfo: StudentInfo
): Boolean {
  return true;
}
