import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentServiceService {
  private apiUrl = 'http://localhost:3000/api/student/'; // Adjust the URL to match your Express route

  constructor(private http: HttpClient) {}

  getStudentData(rollNumber: string): Observable<any> {
    return this.http.get(this.apiUrl + rollNumber);
  }
}