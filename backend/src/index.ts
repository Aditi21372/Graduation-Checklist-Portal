import { DatabaseMap, getStudentDatabase, StudentInfo} from "./database";
import { CSEDegree } from "./degree";
import { SSHRule, CWRule, SGRule, IPRule, OnlineCourseRule, BTPRule, MandateRule, BucketRule, TwoXCreditRule, ThirtyTwoCreditRule} from "./rule";

// Path to the excel sheet containing student records.
const studentRecordsFilePath = "data/Student_Database_2019.xlsm";
const rollNumber = 2019032;
const studentDatabase: DatabaseMap = getStudentDatabase(studentRecordsFilePath);

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

checkGraduation(rollNumber);
