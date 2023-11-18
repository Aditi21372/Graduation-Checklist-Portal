import { StudentInfo } from "./database";
import { disallowedGrades, studentDatabase } from "./index";
import { findCGPA } from "./index";
import { btpRule, thirtyTwoCreditsRule, required156CreditsRule} from "./rule";

export function isHonors(rollNumber: number): Boolean {
  const studentInfo: StudentInfo = studentDatabase[Number(rollNumber)];
  const studentCourses = studentInfo["courses"];

  const extra12CreditsData = thirtyTwoCreditsRule.checkRule(rollNumber, null);
  const requiredCreditsData = required156CreditsRule.checkRule(rollNumber, null);
  const btpRuleData = btpRule.checkRule(rollNumber, null);
  const gpaRuleData = findCGPA(rollNumber);

  if (extra12CreditsData.data < 44) {
    console.log("Credits less than 168");
    console.log("Credits: ", requiredCreditsData.data);
    return false;
  }
  if (requiredCreditsData.data < 168) {
    return false;
  }
  if (btpRuleData.isCompleteText != "Complete") {
    console.log("BTP Credits not completed");
    return false;
  }
  if(gpaRuleData["10"].cgpa < 8.0) {
    return false;
  }

  return true;
}
