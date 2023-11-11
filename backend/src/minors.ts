import {StudentInfo} from "./database";
import { courseDatabase} from "./index";

const disallowedGrades = ["I", "W", "F", "X"];

// checkCoreCourses checks if the core courses for a particular minor have been completed by the student.
// Returns a boolean value to indicate whether the student has completed the courses or not.
function checkCoreCourses(rollNumber: number, studentInfo: StudentInfo, coreCourses: string[]){
    const studentCourses = studentInfo["courses"];

    for (const course of coreCourses){
        let courseCompleted = false;
        for (const studentCourse of studentCourses){
            if (studentCourse["courseCode"] === course) {
                if (!disallowedGrades.includes(studentCourse["grade"])) {
                    courseCompleted = true;
                }
            }
        }
        if(!courseCompleted){
            return false;
        }
    }
    return true;
}

export interface Minors {
    // List the core courses required to be completed for the minors.
    coreCourses: string[];
    // Checks if the minimum number of course work credits have been completed.
    checkMinimumCredits: (rollNumber: number, studentInfo: StudentInfo) => Boolean;
    // Checks if an additional number of credits have been completed through IP/BTP/coursework/etc.
    checkAdditionalCredits: (rollNumber: number, studentInfo: StudentInfo) => Boolean;
    // Checks if all the minor requirements have been completed.
    checkMinorsCompleted: (rollnumber: number, studentInfo: StudentInfo) => Boolean;
}

export class ComputationalBiologyMinors implements Minors {
    coreCourses: string[] = ["BIO213"];

    // satisfiesCourseForMinimumCredits checks if the given course code can be counted in the minimum credit
    // requirements.
    satisfiesCourseForMinimumCredits(courseCode: string): Boolean{
        const disallowedCourses = ["BIO512"]
        const ipCourses = courseDatabase["IP/IS/UR"];
        const startingCode = courseCode.substring(0, 3);
        const disallowedPattern = /^BIOX(?:7[1-9]|80)$/;

        if(disallowedCourses.includes(courseCode) || ipCourses.includes(courseCode) || startingCode === "BTP"){
            return false;
        }

        if(disallowedPattern.test(courseCode)){
            return false;
        }

        if(startingCode === 'BIO' && courseCode[3] >= '5'){
            return true;
        }
        return false;
    }

    // TODO[@dikshasethi2511]: Check for IP/BTP in CB. 
    satisfiesCourseForAdditionalCredits(courseCode: string): Boolean{
        const disallowedCourses = ["BIO512"]
        const startingCode = courseCode.substring(0, 3);
        const disallowedPattern = /^BIOX(?:7[1-9]|80)$/;

        if(disallowedCourses.includes(courseCode)){
            return false;
        }

        if(disallowedPattern.test(courseCode)){
            return false;
        }

        if(startingCode === 'BIO' && courseCode[3] >= '5'){
            return true;
        }
        return false;
    }

    checkMinimumCredits(rollNumber: number, studentInfo: StudentInfo){
        const creditsToComplete = 16;
        let creditsCompleted = 0;
        const studentCourses = studentInfo["courses"];
        for (const studentCourse of studentCourses){
            const semester = studentCourse["semester"];
            const grade = studentCourse["grade"];

            if (semester >= '6' && !disallowedGrades.includes(grade)) {
                if(this.satisfiesCourseForMinimumCredits(studentCourse["courseCode"])){
                    creditsCompleted += studentCourse["credit"]
                }
            }
        }
        return creditsCompleted >= creditsToComplete;
    }

    checkAdditionalCredits(rollNumber: number, studentInfo: StudentInfo){
        const creditsToComplete = 4;
        let creditsCompleted = 0;
        const studentCourses = studentInfo["courses"];
        for (const studentCourse of studentCourses){
            const semester = studentCourse["semester"];
            const grade = studentCourse["grade"];

            if (semester >= '6' && !disallowedGrades.includes(grade)) {
                if(this.satisfiesCourseForAdditionalCredits(studentCourse["courseCode"])){
                    creditsCompleted += studentCourse["credit"]
                }
            }
        }
        return creditsCompleted >= creditsToComplete;
    }

    checkMinorsCompleted(rollNumber: number, studentInfo: StudentInfo){
        let program = studentInfo["program"];
        let branch = program.slice(
            program.lastIndexOf('/') + 1,
            program.length
        );

        let pursuingCSB = branch == 'CSB';
        let coreCoursesCompleted = checkCoreCourses(rollNumber, studentInfo, this.coreCourses);
        let minimumCreditsCompleted = this.checkMinimumCredits(rollNumber, studentInfo);
        let additionalCreditsCompleted = this.checkAdditionalCredits(rollNumber, studentInfo);
        return coreCoursesCompleted && minimumCreditsCompleted && additionalCreditsCompleted && !pursuingCSB;
    }
}