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
    return this.http.get(this.apiUrl + 'student/' + rollNumber);
  }

  getMandatoryCourses(branch: string, rollNumber: number): Observable<any> {
    return this.http.get(
      this.apiUrl + 'degree/' + branch + '/' + String(rollNumber) + '/mandatory'
    );
  }

  getBucketCourses(branch: string, rollNumber: number): Observable<any> {
    return this.http.get(
      this.apiUrl + 'degree/' + branch + '/' + String(rollNumber) + '/bucket'
    );
  }

  getSSHcourses(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + 'degree/' + String(rollNumber) + '/ssh');
  }

  getCWcourses(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + 'degree/' + String(rollNumber) + '/cw');
  }

  getSGcourses(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + 'degree/' + String(rollNumber) + '/sg');
  }

  getBTPCredits(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + 'degree/' + String(rollNumber) + '/btp');
  }

  getTwoXXCredits(rollNumber: number): Observable<any> {
    return this.http.get(
      this.apiUrl + 'degree/' + String(rollNumber) + '/twoxxcourses'
    );
  }

  getIPCredits(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + 'degree/' + String(rollNumber) + '/ip');
  }

  getOnlineCourseCredits(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + 'degree/' + String(rollNumber) + '/onlinecourses');
  }

  get32Credits(rollNumber: number): Observable<any> {
    return this.http.get(this.apiUrl + 'degree/' + String(rollNumber) + '/thirtytwocredits');
  }
}
