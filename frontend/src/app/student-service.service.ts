import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentServiceService {
  private apiUrl = 'http://192.168.3.164:3000/api/';
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

  getSSHcourses(): Observable<any> {
    return this.http.get(this.apiUrl + 'ssh');
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

  getTwoXXCredits(): Observable<any> {
    return this.http.get(this.apiUrl + 'twoxxcourses');
  }

  getIPCredits(): Observable<any> {
    return this.http.get(this.apiUrl + 'ip');
  }

  getOnlineCourseCredits(): Observable<any> {
    return this.http.get(this.apiUrl + 'onlinecourses');
  }

  get32Credits(): Observable<any> {
    return this.http.get(this.apiUrl + 'thirtytwocredits');
  }

  getSemWiseCGPA(): Observable<any> {
    return this.http.get(this.apiUrl + 'semester-wise-cgpa');
  }

  getRequiredCredits(): Observable<any> {
    return this.http.get(this.apiUrl + 'required-credits');
  }

  getTOCCredits(): Observable<any> {
    return this.http.get(this.apiUrl + 'toc');
  }

  getIncompleteGrade(): Observable<any> {
    return this.http.get(this.apiUrl + 'incompletegrade');
  }

  getGraduationStatus(): Observable<any> {
    return this.http.get(this.apiUrl + 'graduation-check');
  }

  getGraduationDate(): Observable<any> {
    return this.http.get(this.apiUrl + 'graduation-date');
  }

  getHonors(): Observable<any> {
    return this.http.get(this.apiUrl + 'honors');
  }

  login(username: string, password: string): Observable<any> {
    return this.http.get(
      this.apiUrl + 'login' + '/' + username + '/' + password
    );
  }

  getStudentCourses(rollNumber: string): Observable<any> {
    return this.http.get(this.apiUrl + 'student' + '/' + rollNumber);
  }

  updateStudent(student: any): Observable<any> {
    return this.http.post(this.apiUrl + 'updateStudent', student);
  }
}
