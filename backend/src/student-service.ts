
// no use


// import { Request, Response } from 'express';
// import { getStudentData, searchByRollNo, updateStudentGrade, preprocessCourseData } from './database';
// import { getGraduationStatus, getGraduationDate } from './degree';
// import { isHonors } from './honors';
// import { isMinors, checkIpBtpForMinors, includeIp, approveApprenticeship } from './minors';
// import { calculateCGPA } from './cgpa';
// import { StudentInfo } from './type';

// export class StudentService {
//   private apiUrl = 'http://192.168.3.164:3002/api/';

//   async getStudentData(rollNumber: string, res: Response) {
//     try {
//       const studentData = await getStudentData(Number(rollNumber));
//       if (studentData.length > 0) {
//         res.json(studentData);
//       } else {
//         res.status(404).json({ error: "Student not found" });
//       }
//     } catch (error) {
//       console.error('Error getting student data:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getStudentCourseData(rollNumber: string, res: Response) {
//     try {
//       const studentInfo = await searchByRollNo(Number(rollNumber));
//       if (studentInfo) {
//         res.json(studentInfo);
//       } else {
//         res.status(404).json({ error: "Student not found" });
//       }
//     } catch (error) {
//       console.error('Error getting student course data:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getMandatoryCourses(branch: string, res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ branch, data: studentData });
//     } catch (error) {
//       console.error('Error getting mandatory courses:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getBucketCourses(branch: string, res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ branch, data: studentData });
//     } catch (error) {
//       console.error('Error getting bucket courses:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getSSHcourses(branch: string, res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ branch, data: studentData });
//     } catch (error) {
//       console.error('Error getting SSH courses:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getCWcourses(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ data: studentData });
//     } catch (error) {
//       console.error('Error getting CW courses:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getSGcourses(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ data: studentData });
//     } catch (error) {
//       console.error('Error getting SG courses:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getBTPCredits(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ data: studentData });
//     } catch (error) {
//       console.error('Error getting BTP credits:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getTwoXXCredits(branch: string, res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ branch, data: studentData });
//     } catch (error) {
//       console.error('Error getting 2XX credits:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getIPCredits(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ data: studentData });
//     } catch (error) {
//       console.error('Error getting IP credits:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getOnlineCourseCredits(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ data: studentData });
//     } catch (error) {
//       console.error('Error getting online course credits:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async get32Credits(branch: string, res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ branch, data: studentData });
//     } catch (error) {
//       console.error('Error getting 32 credits:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getCsai(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ data: studentData });
//     } catch (error) {
//       console.error('Error getting CSAI data:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getEcoMajorCore(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ data: studentData });
//     } catch (error) {
//       console.error('Error getting Eco Major Core:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getEcoMajorElective(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ data: studentData });
//     } catch (error) {
//       console.error('Error getting Eco Major Elective:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getSSHMajor(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ data: studentData });
//     } catch (error) {
//       console.error('Error getting SSH Major:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getSemWiseCGPA(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       const cgpa = calculateCGPA(studentData);
//       res.json({ cgpa });
//     } catch (error) {
//       console.error('Error getting semester-wise CGPA:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getRequiredCredits(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ data: studentData });
//     } catch (error) {
//       console.error('Error getting required credits:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getIncompleteGrade(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       res.json({ data: studentData });
//     } catch (error) {
//       console.error('Error getting incomplete grade:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getGraduationStatus(branch: string, res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       const status = await getGraduationStatus(studentData, branch);
//       res.json({ status });
//     } catch (error) {
//       console.error('Error getting graduation status:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getGraduationDate(branch: string, res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       const date = getGraduationDate(studentData, branch);
//       res.json({ date });
//     } catch (error) {
//       console.error('Error getting graduation date:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getHonors(branch: string, res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       const honors = isHonors(studentData, branch);
//       res.json({ honors });
//     } catch (error) {
//       console.error('Error getting honors:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getMinors(res: Response) {
//     try {
//       const studentData = await preprocessCourseData(await getStudentData(0));
//       const minors = isMinors(studentData);
//       res.json({ minors });
//     } catch (error) {
//       console.error('Error getting minors:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async updateMinors(ipData: any, minorsBranch: string, res: Response) {
//     try {
//       const result = await includeIp(ipData, minorsBranch, 0);
//       res.json({ result });
//     } catch (error) {
//       console.error('Error updating minors:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async login(username: string, password: string, res: Response) {
//     try {
//       if (username === "iiitdadmin" && password === "Admin@2019") {
//         res.json(true);
//       } else {
//         res.status(404).json({ error: "User not found" });
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async studentLogin(username: string, password: string, res: Response) {
//     try {
//       const rollNo = await searchByRollNo(Number(username));
//       if (rollNo) {
//         res.json(rollNo);
//       } else {
//         res.status(404).json({ error: "Wrong Credentials" });
//       }
//     } catch (error) {
//       console.error('Error during student login:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getStudentCourses(rollNumber: string, res: Response) {
//     try {
//       const studentData = await getStudentData(Number(rollNumber));
//       if (studentData.length > 0) {
//         res.json(studentData);
//       } else {
//         res.status(404).json({ error: "Student not found" });
//       }
//     } catch (error) {
//       console.error('Error getting student courses:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async getChecklist(rollNumber: string, res: Response) {
//     try {
//       const studentInfo = await searchByRollNo(Number(rollNumber));
//       if (!studentInfo) {
//         res.status(404).json({ error: "Student not found" });
//         return;
//       }

//       const studentData = await preprocessCourseData(await getStudentData(Number(rollNumber)));
//       res.json({
//         studentInfo,
//         studentData
//       });
//     } catch (error) {
//       console.error('Error getting checklist:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async updateStudent(student: any, res: Response) {
//     try {
//       const updatedStudent = await updateStudentGrade(student);
//       if (updatedStudent) {
//         res.json(updatedStudent);
//       } else {
//         res.status(404).json({ error: "Student not found" });
//       }
//     } catch (error) {
//       console.error('Error updating student:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   async updateStudentMinors(rollNumber: string, type: string, res: Response) {
//     try {
//       const studentData = await getStudentData(Number(rollNumber));
//       if (studentData.length <= 0) {
//         res.status(404).json({ error: "Student not found" });
//         return;
//       }

//       let result;
//       if (type === "IP" || type === "BTP") {
//         result = await checkIpBtpForMinors(studentData, type);
//       } else if (type === "Apprenticeship") {
//         result = await approveApprenticeship(studentData);
//       }

//       res.json({ result });
//     } catch (error) {
//       console.error('Error updating student minors:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// }
