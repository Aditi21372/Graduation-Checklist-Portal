import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpRequest } from '@angular/common/http';

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

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const request = new HttpRequest('POST', this.apiUrl + 'upload', formData, {
      reportProgress: true,
    });

    return this.http.request(request);
  }
}
