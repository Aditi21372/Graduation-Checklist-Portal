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
  let checkSummer4 = false;

  for (let course of studentInfo.courses) {
    if (Number(course.semester) > maxSem) maxSem = Number(course.semester);
    if (course.semester === "Summer Term 4") checkSummer4 = true;
  }

  for (let i = 1; i <= maxSem; i++) {
    semesters.push(String(i));

    if (i % 2 === 0) {
      let summerSem = "Summer Term " + String(i / 2);
      semesters.push(summerSem);
    }
  }

  if (!checkSummer4 || maxSem === 10) {
    semesters.splice(11, 1);
  }
  return semesters;
}

function calculateBestCgpa(
  cumulativeGradeSum: number,
  cumulativeCreditSum: number,
  coursesTaken: Map<string, Course>,
  worseCreds: number
): number {
  const creditGroups = new Map<number, number[]>();
  for (const [_, course] of coursesTaken) {
    const { grade, credit } = course;
    if (creditGroups.has(credit)) {
      creditGroups.get(credit)!.push(grade);
    } else {
      creditGroups.set(credit, [grade]);
    }
  }

  creditGroups.forEach((courses, _) => {
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
      possibleWorstCredits += credit * count;
      if (
        creditGroups.has(credit) &&
        creditGroups.get(credit)!.length >= count &&
        possibleWorstCredits <= worseCreds
      ) {
        const grades = creditGroups.get(credit)!;
        while (grades.length > 0) {
          if (grades[0] === 2) {
            grades.shift();
          } else {
            break;
          }
        }
        if (grades.length < count) {
          flag = false;
          break;
        }
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
    let repeatedCredits = 0;
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
            repeatedCredits += course.credit;
            gradeSum += gradeMap[course.grade] * course.credit;
            if (prevGrade === 2) {
              cumulativeCreditSum += course.credit;
            } else {
              cumulativeGradeSum -= prevGrade * course.credit;
            }
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
    if (creditSum + repeatedCredits !== 0) {
      sgpa = gradeSum / (creditSum + repeatedCredits);
    }
    if (!(semesters[i].startsWith("Summer") && sgpa == 0)) {
      cgpa = cumulativeGradeSum / cumulativeCreditSum;
    }

    let flag = 0;
    let worseCreds = 0;
    [flag, worseCreds] = getWorseCreds(
      semesters,
      semesters[i],
      cumulativeCreditSum + onlineCreds
    );

    if (flag == 1) {
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

function getWorseCreds(
  semesters: string[],
  semester: string,
  cumulativeCreditSum: number
): [number, number] {
  let flag = 0;
  let worseCreds = 0;
  if (
    (Number(semester) == 6 || semester === "Summer Term 3") &&
    cumulativeCreditSum > 116
  ) {
    worseCreds = Math.min(8, cumulativeCreditSum - 116);
    flag = 1;
  }

  if (Number(semester) == 7 && cumulativeCreditSum > 136) {
    worseCreds = Math.min(8, cumulativeCreditSum - 136);
    flag = 1;
  }

  if (semesters.indexOf(semester) >= 10) {
    if (semesters.length - 1 > semesters.indexOf(semester)) {
      if (cumulativeCreditSum > 156) {
        worseCreds = Math.min(8, cumulativeCreditSum - 156);
        flag = 1;
      }
    } else {
      if (cumulativeCreditSum > 152) {
        worseCreds = Math.min(8, cumulativeCreditSum - 152);
        flag = 1;
      }
    }
  }
  return [flag, worseCreds];
}
