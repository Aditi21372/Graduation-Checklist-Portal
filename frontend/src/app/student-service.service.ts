import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentServiceService {
  private apiUrl = '/api/student'; // Adjust the URL to match your Express route

  constructor(private http: HttpClient) {}

  getStudentData(rollNumber: string): Observable<any> {
    // Include the roll number as a query parameter in the request
    const params = { rollNumber };
    return this.http.get(this.apiUrl, { params });
  }
}
