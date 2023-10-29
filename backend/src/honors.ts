import { StudentInfo } from "./database";
import { courseDatabase, disallowedGrades } from "./index";
import { calculateCGPA } from "./cgpa";

// Add other BTP codes here
const btpCourses = ["BTP499"];

export function isHonors(
  rollNumber: number,
  studentInfo: StudentInfo
): Boolean {
  const studentCourses = studentInfo["courses"];
  let credits = 0;
  let btpCredits = 0;

  for (const course of studentCourses) {
    // Check total credits
    if (!(course["grade"] in disallowedGrades)) {
      credits += course["credit"];
    }
    // Check BTP credits
    if (
      course["courseCode"] in btpCourses &&
      !(course["grade"] in disallowedGrades)
    ) {
      btpCredits += course["credit"];
    }
  }

  // Check if 12 additional credts are done
  if (credits < 168) {
    return false;
  }

  // Check if BTP is done
  if (credits > 12 || credits < 8) {
    return false;
  }
  // Check if CGPA is greater than 8
  if (calculateCGPA(rollNumber, studentInfo).cgpa < 8) {
    return false;
  }

  return true;
}
