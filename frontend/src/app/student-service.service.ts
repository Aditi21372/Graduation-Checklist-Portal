import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StudentServiceService {
  private apiUrl = 'http://192.168.3.164:3002/api/';
  private graduationStatusSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  setGraduationStatus(status: string): void {
    this.graduationStatusSubject.next(status);
  }

  getGraduationStatusFromChecklist(): Observable<string> {
    return this.graduationStatusSubject.asObservable();
  }

  constructor(private http: HttpClient) {}

  getStudentData(rollNumber: string): Observable<any> {
    
    return this.http.get(this.apiUrl + String(rollNumber) + '/info');
  }

  getStudentCourseData(rollNumber: string): Observable<any> {
    return this.http.get(this.apiUrl + String(rollNumber) + '/courseinfo');
  }

  getMandatoryCourses(branch: string): Observable<any> {
    return this.http.get(this.apiUrl + branch + '/mandatory');
  }

  getBucketCourses(branch: string): Observable<any> {
    return this.http.get(this.apiUrl + branch + '/bucket');
  }

  getSSHcourses(branch: string): Observable<any> {
    return this.http.get(this.apiUrl + branch + '/ssh');
  }

  getCWcourses(): Observable<any> {
    return this.http.get(this.apiUrl + 'cw');
  }

  getSGcourses(): Observable<any> {
    return this.http.get(this.apiUrl + 'sg');
  }

  getBTPCredits(): Observable<any> {
    return this.http.get(this.apiUrl + 'btp');
  }

  getTwoXXCredits(branch: string): Observable<any> {
    return this.http.get(this.apiUrl + branch + '/twoxxcourses');
  }

  getIPCredits(): Observable<any> {
    return this.http.get(this.apiUrl + 'ip');
  }

  getOnlineCourseCredits(): Observable<any> {
    return this.http.get(this.apiUrl + 'onlinecourses');
  }

  get32Credits(branch: string): Observable<any> {
    return this.http.get(this.apiUrl + branch + '/thirtytwocredits');
  }

  getCsai(): Observable<any> {
    return this.http.get(this.apiUrl + 'csai');
  }

  getEcoMajorCore(): Observable<any> {
    return this.http.get(this.apiUrl + 'eco-major-core');
  }

  getEcoMajorElective(): Observable<any> {
    return this.http.get(this.apiUrl + 'eco-major-elective');
  }

  getSSHMajor(): Observable<any> {
    return this.http.get(this.apiUrl + 'ssh-major');
  }

  getSemWiseCGPA(): Observable<any> {
    return this.http.get(this.apiUrl + 'semester-wise-cgpa');
  }

  getRequiredCredits(): Observable<any> {
    return this.http.get(this.apiUrl + 'required-credits');
  }

  getIncompleteGrade(): Observable<any> {
    return this.http.get(this.apiUrl + 'incompletegrade');
  }

  getGraduationStatus(branch: string): Observable<any> {
    return this.http.get(this.apiUrl + branch + '/graduation-check');
  }

  getGraduationDate(branch: string): Observable<any> {
    return this.http.get(this.apiUrl + branch + '/graduation-date');
  }

  getHonors(branch: string): Observable<any> {
    return this.http.get(this.apiUrl + branch + '/honors');
  }

  getMinors(): Observable<any> {
    return this.http.get(this.apiUrl + 'minors');
  }

  updateMinors(ipData: any, minorsBranch: string): Observable<any> {
    return this.http.post(this.apiUrl + 'update-minors', [
      ipData,
      minorsBranch,
    ]);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.get(
      this.apiUrl + 'login' + '/' + username + '/' + password
    );
  }

  studentLogin(username: string, password: string): Observable<any> {
    return this.http.get(
      this.apiUrl + 'student-login' + '/' + username + '/' + password
    );
  }

  getStudentCourses(rollNumber: string): Observable<any> {
    return this.http.get(this.apiUrl + 'student' + '/' + rollNumber);
  }

  updateStudent(student: any): Observable<any> {
    return this.http.post(this.apiUrl + 'updateStudent', student);
  }

  updateStudentMinors(rollNumber: string, type: string): Observable<any> {
    return this.http.post(this.apiUrl + 'update-student-minors', {
      rollNumber: rollNumber,
      type: type,
    });
  }

  uploadStudentDatabaseFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const request = new HttpRequest(
      'POST',
      this.apiUrl + 'upload-student-database',
      formData,
      {
        reportProgress: true,
      }
    );
    return this.http.request(request);
  }

  uploadCourseDatabaseFile(file: File, fileName: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, fileName);

    const request = new HttpRequest(
      'POST',
      this.apiUrl + 'upload-course-database',
      formData,
      {
        reportProgress: true,
      }
    );

    return this.http.request(request);
  }

  uploadStudentsDetailsFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const request = new HttpRequest(
      'POST',
      this.apiUrl + 'upload-students-details',
      formData,
      {
        reportProgress: true,
      }
    );

    return this.http.request(request);
  }

  getBtpForSemLeave(rollNumber: string): Observable<any> {
    return this.http.get(this.apiUrl + 'btp-sem-leave/' + rollNumber);
  }

  updateBtp(data: any, rollNumber: Number): Observable<any> {
    return this.http.post(this.apiUrl + 'include-btp', [data, rollNumber]);
  }

  getStudentDetails(): Observable<any> {
    return this.http.get(this.apiUrl + 'get-students-details', {
      responseType: 'arraybuffer',
    });
  }

  generateSummary(): Observable<any> {
    return this.http.get(this.apiUrl + 'generate-summary');
  }

  getSummary(batch: Number): Observable<any> {
    return this.http.get(this.apiUrl + batch + '/summary');
  }

  donwloadSummary(batch: Number): Observable<any> {
    return this.http.get(this.apiUrl + batch + '/download-summary', {
      responseType: 'arraybuffer',
    });
  }

  requestProvisional(rollNumber: string): Observable<any> {
    return this.http.get(this.apiUrl + 'request-provisional/' + rollNumber);
  }

  getProvisionalRequests(): Observable<any> {
    return this.http.get(this.apiUrl + 'provisional-requests');
  }

  acceptProvisionalRequest(rollNumber: string): Observable<any> {
    return this.http.get(this.apiUrl + 'accept-request/' + rollNumber);
  }

  getStudentTwiceFailCourses(rollNumber: string): Observable<any> {
    return this.http.get(this.apiUrl + 'twice-fail/' + rollNumber);
  }

  getSubsituteCourses(rollNumber: string, course: string): Observable<any> {
    return this.http.get(
      this.apiUrl + 'substitute-twice-fail/' + rollNumber + '/' + course
    );
  }

  updateTwiceFailCourses(
    rollNumber: string,
    failCourse: String,
    subCourse: String
  ): Observable<any> {
    return this.http.post(this.apiUrl + 'update-twice-fail', [
      rollNumber,
      failCourse,
      subCourse,
    ]);
  }
}
