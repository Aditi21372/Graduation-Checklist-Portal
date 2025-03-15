"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHonors = void 0;
const cgpa_1 = require("./cgpa");
const rule_1 = require("./rule");
function isHonors(studentCourseData, branch) {
    let ruleData = [];
    const extra12CreditsData = rule_1.thirtyTwoCreditsRule.checkRule(studentCourseData, branch);
    const requiredCreditsData = rule_1.required156CreditsRule.checkRule(studentCourseData, branch);
    const btpRuleData = rule_1.btpRule.checkRule(studentCourseData, null);
    const gpaRuleData = (0, cgpa_1.calculateCGPA)(studentCourseData);
    const extraCredits = extra12CreditsData.data.totalCredits - 32;
    if (extraCredits >= 12) {
        ruleData.push({
            rule: "Extra 12 credits",
            value: extraCredits.toString(),
            status: "Yes",
        });
    }
    else {
        ruleData.push({
            rule: "Extra 12 credits",
            value: extraCredits > 0 ? extraCredits.toString() : "0",
            status: "No",
        });
    }
    if (requiredCreditsData.data >= 168) {
        ruleData.push({
            rule: "Required 168 Credits",
            value: requiredCreditsData.data,
            status: "Yes",
        });
    }
    else {
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
    }
    else {
        ruleData.push({
            rule: "BTP",
            value: btpRuleData.data.totalCredits,
            status: "No",
        });
    }
    if (gpaRuleData["10"].cgpa >= 8.0) {
        ruleData.push({
            rule: "CGPA",
            value: gpaRuleData["10"].cgpa.toString(),
            status: "Yes",
        });
    }
    else {
        ruleData.push({
            rule: "CGPA",
            value: gpaRuleData["10"].cgpa.toString(),
            status: "No",
        });
    }
    let returnData = {
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
exports.isHonors = isHonors;
