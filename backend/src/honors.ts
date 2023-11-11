import { StudentInfo } from "./database";
import { disallowedGrades, studentDatabase } from "./index";
import { calculateCGPA } from "./cgpa";
import { btpRule, required156CreditsRule } from "./rule";
// Add other BTP codes here
const btpCourses = ["BTP499"];

export function isHonors(rollNumber: number): Boolean {
  const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
  const studentCourses = studentInfo["courses"];
  let credits = 0;
  let btpCredits = 0;

  const requiredCreditsData = required156CreditsRule.checkRule(rollNumber, null);

  const btpRuleData = btpRule.checkRule(rollNumber, null);

  if (requiredCreditsData.data < 168) {
    console.log("Credits less than 168");
    console.log("Credits: ", requiredCreditsData.data);
    return false;
  }
  // Check BTP completed
  if (!btpRuleData.isComplete) {
    console.log("BTP Credits not completed");

    return false;
  }

  // Check if CGPA is greater than 8
  // if (calculateCGPA(studentInfo)[-1].cgpa < 8) {
  //   console.log("CGPA less than 8");
  //   return false;
  // }

  return true;
}
