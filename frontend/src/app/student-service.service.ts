import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentServiceService {
  private apiUrl = 'http://localhost:3000/api/'; // Adjust the URL to match your Express route

  constructor(private http: HttpClient) {}

  getStudentData(rollNumber: string): Observable<any> {
    return this.http.get(this.apiUrl + String(rollNumber) + '/info');
  }

  getMandatoryCourses(branch: string, rollNumber: number): Observable<any> {
    return this.http.get(
      this.apiUrl + branch + '/' + String(rollNumber) + '/mandatory'
    );
  }

  getBucketCourses(branch: string, rollNumber: number): Observable<any> {
    return this.http.get(
      this.apiUrl + branch + '/' + String(rollNumber) + '/bucket'
    );
  }

  getSSHcourses(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + String(rollNumber) + '/ssh');
  }

  getCWcourses(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + String(rollNumber) + '/cw');
  }

  getSGcourses(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + String(rollNumber) + '/sg');
  }

  getBTPCredits(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + String(rollNumber) + '/btp');
  }

  getTwoXXCredits(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + String(rollNumber) + '/twoxxcourses');
  }

  getIPCredits(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + String(rollNumber) + '/ip');
  }

  getOnlineCourseCredits(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + String(rollNumber) + '/onlinecourses');
  }

  get32Credits(rollNumber: number): Observable<any> {
    return this.http.get(
      this.apiUrl + String(rollNumber) + '/thirtytwocredits'
    );
  }

  getSemWiseCGPA(rollNumber: number): Observable<any> {
    return this.http.get(
      this.apiUrl + String(rollNumber) + '/semester-wise-cgpa'
    );
  }

  getRequiredCredits(rollNumber: number): Observable<any> {
    return this.http.get(
      this.apiUrl + String(rollNumber) + '/required-credits'
    );
  }

  getIncompleteGrade(rollNumber: number): Observable<any> {
    return this.http.get(
      this.apiUrl + String(rollNumber) + '/incompletegrade'
    );
  }

  getGraduationStatus(rollNumber: number): Observable<any> {
    return this.http.get(
      this.apiUrl + String(rollNumber) + '/graduation-check'
    );
  }

  getHonors(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + String(rollNumber) + '/honors');
  }

  login(username: string, password: string): Observable<any> {
    const credentials = { username, password };
    return this.http.get(this.apiUrl + 'login' + '/' + username + '/' + password);
  }
}
