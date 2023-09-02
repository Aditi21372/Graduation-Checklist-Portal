import { StudentInfo } from "./database";

export interface IRule {
  ruleId: number;
  checkRule: (rollNumber: number, studentInfo: StudentInfo) => Boolean;
}

export class SSHRule implements IRule {
  ruleId: number = 0;

  checkRule(rollNumber: number, studentInfo: StudentInfo): Boolean {
    return true;
  }
}
