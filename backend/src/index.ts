import { calculateCGPA } from "./cgpa";
import {
  DatabaseMap,
  getStudentDatabase,
  StudentInfo,
  CourseMap,
  getCourseDatabase,
} from "./database";
import { CSEDegree } from "./degree";
import {
  SSHRule,
  CWRule,
  SGRule,
  IPRule,
  OnlineCourseRule,
  BTPRule,
  MandateRule,
  BucketRule,
  TwoXCreditRule,
  ThirtyTwoCreditRule,
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

function checkGraduation(rollNumber: number): Boolean {
  // Simple example for 1 rule in CSE
  const student: StudentInfo = studentDatabase[rollNumber];
  const degree: CSEDegree = new CSEDegree();
  const sshRule: SSHRule = new SSHRule();
  const cwRule: CWRule = new CWRule();
  const sgRule: SGRule = new SGRule();
  const ipRule: IPRule = new IPRule();
  const onlineCourseRule: OnlineCourseRule = new OnlineCourseRule();
  const btpRule: BTPRule = new BTPRule();
  const mandateRule: MandateRule = new MandateRule();
  const bucketRule: BucketRule = new BucketRule();
  const twoXCreditRule: TwoXCreditRule = new TwoXCreditRule();
  const thirtyTwoCreditRule: ThirtyTwoCreditRule = new ThirtyTwoCreditRule();

  degree.addRule(sshRule);
  degree.addRule(cwRule);
  degree.addRule(sgRule);
  degree.addRule(ipRule);
  degree.addRule(onlineCourseRule);
  degree.addRule(btpRule);
  degree.addRule(mandateRule);
  degree.addRule(bucketRule);
  degree.addRule(twoXCreditRule);
  degree.addRule(thirtyTwoCreditRule);

  let isPassed: Boolean = true;
  for (let rule of degree.graduationRules) {
    if (!rule.checkRule(rollNumber, student)) {
      isPassed = false;
    }
  }

  if (isPassed) {
    console.log("Student Passed");
    return true;
  } else {
    console.log("Student Failed");
    return false;
  }
}

export function findCGPA(rollNumber: number) {
  const student: StudentInfo = studentDatabase[rollNumber];
  return calculateCGPA(student);
}

// checkGraduation(rollNumber);
