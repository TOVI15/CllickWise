import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = 'https://localhost:7278/api';
  constructor(private http: HttpClient) { }

  login(form: any): Observable<any> {
    console.log("good", form);
    return this.http.post(`${this.apiUrl}/Students`, form);
  }

  getPresignedUrl(fileName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/upload/presigned-url`, {
      params: { fileName },
    });
  }

  // שלב 2: העלאת הקובץ ל-S3
  uploadFileToS3(presignedUrl: string, file: File): Observable<any> {
    return this.http.put(presignedUrl, file, {
      headers: { 'Content-Type': file.type },
    });
  }
}
