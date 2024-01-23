import { StudentInfo } from "./database";
import { calculateCGPA } from "./cgpa";
import {
  btpRule,
  thirtyTwoCreditsRule,
  required156CreditsRule,
  onlineCoursesHonorsRule,
} from "./rule";

type ruleEntry = {
  rule: string;
  value: "";
  status: "No" | "Yes";
};

type ruleData = {
  isCompleteBool: boolean;
  isCompleteText: "Done" | "Not Done";
  data: ruleEntry[];
};

export function isHonors(studentCourseData: StudentInfo): ruleData {
  let ruleData: ruleEntry[] = [];
  const extra12CreditsData = thirtyTwoCreditsRule.checkRule(
    studentCourseData,
    "CSE"
  );
  const requiredCreditsData = required156CreditsRule.checkRule(
    studentCourseData,
    "CSE"
  );
  const onlineCoursesData = onlineCoursesHonorsRule.checkRule(
    studentCourseData,
    "CSE"
  );
  const btpRuleData = btpRule.checkRule(studentCourseData, null);
  const gpaRuleData = calculateCGPA(studentCourseData);

  const extraCredits =
    extra12CreditsData.data.totalCredits +
    onlineCoursesData.data.totalCredits -
    32;

  if (extraCredits >= 12) {
    ruleData.push({
      rule: "Extra 12 credits",
      value: extraCredits.toString() as "",
      status: "Yes",
    });
  } else {
    ruleData.push({
      rule: "Extra 12 credits",
      value: extraCredits.toString() as "",
      status: "No",
    });
  }

  if (requiredCreditsData.data >= 168) {
    ruleData.push({
      rule: "Required 168 Credits",
      value: requiredCreditsData.data,
      status: "Yes",
    });
  } else {
    ruleData.push({
      rule: "Required 168 Credits",
      value: requiredCreditsData.data,
      status: "No",
    });
  }

  if (btpRuleData.isCompleteText == "Complete") {
    ruleData.push({
      rule: "BTP",
      value: btpRuleData.data.totalCredits,
      status: "Yes",
    });
  } else {
    ruleData.push({
      rule: "BTP",
      value: btpRuleData.data.totalCredits,
      status: "No",
    });
  }

  if (gpaRuleData["10"].cgpa >= 8.0) {
    ruleData.push({
      rule: "CGPA",
      value: gpaRuleData["10"].cgpa.toString() as "",
      status: "Yes",
    });
  } else {
    ruleData.push({
      rule: "CGPA",
      value: gpaRuleData["10"].cgpa.toString() as "",
      status: "No",
    });
  }

  let returnData: ruleData = {
    isCompleteBool: true,
    isCompleteText: "Done",
    data: ruleData,
  };

  for (let i = 0; i < ruleData.length; i++) {
    if (ruleData[i].status == "No") {
      returnData.isCompleteText = "Not Done";
      break;
    }
  }

  return returnData;
}
