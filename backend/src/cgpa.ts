import { Grade, Course, GradeMap, CreditGroups, StudentInfo } from "./type";

const gradeMap: GradeMap = {
  "A+": 10,
  A: 10,
  "A-": 9,
  B: 8,
  "B-": 7,
  C: 6,
  "C-": 5,
  D: 4,
  F: 2,
};
const disallowedGrades: string[] = ["I", "W", "X"];
const possibleWorstCreditsPairs: CreditGroups[] = [
  { 8: 1 },
  { 6: 1, 2: 1 },
  { 4: 2 },
  { 4: 1, 2: 2 },
  { 2: 4 },
  { 6: 1 },
  { 4: 1, 2: 1 },
  { 2: 3 },
  { 4: 1 },
  { 2: 2 },
  { 2: 1 },
];

// Function to calculate CGPA
export function calculateCGPA(studentInfo: StudentInfo): Grade[] {
  const semesters = getSemesters(studentInfo);
  return calculateSGPA(studentInfo, semesters);
}

// Function to get semesters
function getSemesters(studentInfo: StudentInfo): string[] {
  let maxSem = 8;
  let semesters: string[] = [];

  for (let course of studentInfo.courses) {
    if (Number(course.semester) > maxSem) maxSem = Number(course.semester);
  }

  for (let i = 1; i <= maxSem; i++) {
    semesters.push(String(i));

    if (i % 2 === 0) {
      let summerSem = "Summer Term " + String(i / 2);
      semesters.push(summerSem);
    }
  }

  semesters.splice(11, 1);
  return semesters;
}

function calculateBestCgpa(
  cumulativeGradeSum: number,
  cumulativeCreditSum: number,
  coursesTaken: Map<string, Course>,
  worseCreds: number
): number {
  const creditGroups = new Map<number, number[]>();
  for (const [courseCode, course] of coursesTaken) {
    const { grade, credit } = course;
    if (creditGroups.has(credit)) {
      creditGroups.get(credit)!.push(grade);
    } else {
      creditGroups.set(credit, [grade]);
    }
  }

  creditGroups.forEach((courses, credit) => {
    courses.sort((a, b) => a - b);
  });

  const gpaAfterRemoval = Array(possibleWorstCreditsPairs.length + 1).fill(0);
  gpaAfterRemoval[11] = cumulativeGradeSum / cumulativeCreditSum;
  let counter = 0;
  for (const pairs of possibleWorstCreditsPairs) {
    let worseGradeSum = 0;
    let worstCreditSum = 0;
    let flag = true;
    let possibleWorstCredits = 0;
    for (const credits of Object.keys(pairs)) {
      const credit = Number(credits);
      const count = pairs[credit];
      possibleWorstCredits += credit;
      if (
        creditGroups.has(credit) &&
        creditGroups.get(credit)!.length >= count &&
        possibleWorstCredits <= worseCreds
      ) {
        const grades = creditGroups.get(credit)!;
        for (let i = 0; i < count; i++) {
          const grade = grades[i];
          worseGradeSum += grade * credit;
          worstCreditSum += credit;
        }
      } else {
        flag = false;
        break;
      }
    }
    if (flag) {
      gpaAfterRemoval[counter] =
        (cumulativeGradeSum - worseGradeSum) /
        (cumulativeCreditSum - worstCreditSum);
    }
    counter++;
  }
  return Math.max(...gpaAfterRemoval);
}

function calculateSGPA(studentInfo: StudentInfo, semesters: string[]): Grade[] {
  let semwiseGpa = [];
  let cumulativeGradeSum = 0;
  let cumulativeCreditSum = 0;
  let cgpa = 0;
  let onlineCreds = 0;
  let btpCount = 0;
  let ipCount = 0;
  let coursesTaken = new Map<string, Course>();
  for (let i = 0; i < semesters.length; i++) {
    let creditSum = 0;
    let gradeSum = 0;
    let failCredits = 0;
    let semesterGpa: Grade = { semester: "", sgpa: 0, cgpa: 0 };
    for (let course of studentInfo.courses) {
      if (String(course.semester) === semesters[i]) {
        if (disallowedGrades.includes(course.grade)) continue;
        if (coursesTaken.has(course.courseCode)) {
          const prevGrade = coursesTaken.get(course.courseCode)?.grade;
          if (prevGrade && prevGrade < gradeMap[course.grade]) {
            const courseGrade: Course = {
              grade: gradeMap[course.grade],
              credit: course.credit,
            };
            coursesTaken.set(course.courseCode, courseGrade);
            cumulativeGradeSum -= prevGrade * course.credit;
            gradeSum += gradeMap[course.grade] * course.credit;
            continue;
          } else continue;
        } else {
          if (course.grade === "F") {
            gradeSum += 2 * course.credit;
            creditSum += course.credit;
            failCredits += course.credit;
            const courseGrade: Course = {
              grade: gradeMap[course.grade],
              credit: course.credit,
            };
            coursesTaken.set(course.courseCode, courseGrade);
            continue;
          }
          if (course.grade === "S") {
            if (course.courseCode.startsWith("MSC")) continue;
            else {
              onlineCreds += course.credit;
            }
            continue;
          }
          if (course.courseCode.startsWith("BTP")) {
            btpCount += 1;
            const courseGrade: Course = {
              grade: gradeMap[course.grade],
              credit: course.credit,
            };
            const btpName = course.courseCode + String(btpCount);
            coursesTaken.set(btpName, courseGrade);
            creditSum += course.credit;
            gradeSum += gradeMap[course.grade] * course.credit;
            continue;
          }

          if (
            course.courseCode.startsWith("BIP") ||
            course.courseCode.startsWith("BIS") ||
            course.courseCode.startsWith("BUR")
          ) {
            ipCount += 1;
            const courseGrade: Course = {
              grade: gradeMap[course.grade],
              credit: course.credit,
            };
            const ipName = course.courseCode + String(ipCount);
            coursesTaken.set(ipName, courseGrade);
            creditSum += course.credit;
            gradeSum += gradeMap[course.grade] * course.credit;
            continue;
          }
        }
        const courseGrade: Course = {
          grade: gradeMap[course.grade],
          credit: course.credit,
        };
        coursesTaken.set(course.courseCode, courseGrade);
        creditSum += course.credit;
        gradeSum += gradeMap[course.grade] * course.credit;
      }
    }
    cumulativeCreditSum += creditSum - failCredits;
    cumulativeGradeSum += gradeSum - 2 * failCredits;

    let sgpa = 0;
    if (creditSum !== 0) {
      sgpa = gradeSum / creditSum;
    }

    cgpa = cumulativeGradeSum / cumulativeCreditSum;

    if (
      Number(semesters[i]) >= 6 &&
      cumulativeCreditSum + onlineCreds > 116 + 20 * (Number(semesters[i]) - 6)
    ) {
      const extraCreds =
        cumulativeCreditSum +
        onlineCreds -
        116 +
        20 * (Number(semesters[i]) - 6);
      const worseCreds = Math.min(8, extraCreds);
      cgpa = calculateBestCgpa(
        cumulativeGradeSum,
        cumulativeCreditSum,
        coursesTaken,
        worseCreds
      );
    }

    semesterGpa = {
      semester: semesters[i],
      sgpa: Math.round(sgpa * 100) / 100,
      cgpa: Math.round(cgpa * 100) / 100,
    };
    semwiseGpa.push(semesterGpa);
  }

  return semwiseGpa;
}
