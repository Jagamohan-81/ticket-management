// subject.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
interface Subject {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiUrl = 'http://localhost:8000/subject/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `token ${token}`);
  }
  getSubjects(): Observable<Subject[]> {
    return this.http
      .get<{ results: Subject[] }>(this.apiUrl)
      .pipe(map((response: { results: Subject[] }) => response.results));
  }
  addSubject(newSubject: Subject): Observable<Subject> {
    return this.http.post<Subject>(this.apiUrl, newSubject);
  }

  editSubject(subjectId: number, updatedSubject: Subject): Observable<Subject> {
    const editUrl = `${this.apiUrl}${subjectId}/`;
    return this.http.put<Subject>(editUrl, updatedSubject);
  }
  deleteSubject(subjectId: number): Observable<Subject> {
    const editUrl = `${this.apiUrl}${subjectId}/`;
    return this.http.delete<Subject>(editUrl);
  }

  allMarks() {
    return this.http
      .get('http://localhost:8000/marks/')
      .pipe(map((response: any) => response.results));
  }
}
