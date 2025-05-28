import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = 'https://localhost:7278/api';
  constructor(private http: HttpClient) { }

  login(form: any, folderName: string ): Observable<any> {
    console.log("good", form);
    const formData = new FormData();
    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('paymentMethod', form.paymentMethod);
    formData.append('identityNumber', form.identityNumber);
    formData.append('kohen_Levi_Israel', form.kohen_Levi_Israel);
    formData.append('address', form.address);
    formData.append('city', form.city);
    formData.append('phone', form.phone);
    formData.append('countryOfBirth', form.countryOfBirth);
    formData.append('buildingNumber', form.buildingNumber);
    formData.append('folderKey', folderName);

    formData.append('hebrewDateOfBirth', form.hebrewDateOfBirth);
    formData.append('dateOfBirth', form.dateOfBirth);
    formData.append('healthInsurance', form.healthInsurance);
    
    const additionalInfo = form.additionalInfo;
    formData.append('fatherName', additionalInfo.fatherName);
    formData.append('fatherPhone', additionalInfo.fatherPhone);
    formData.append('fatherCountryOfOrigin', additionalInfo.fatherCountryOfOrigin);
    formData.append('motherName', additionalInfo.motherName);
    formData.append('motherPhone', additionalInfo.motherPhone);
    formData.append('motherOccupation', additionalInfo.motherOccupation);
    formData.append('email', additionalInfo.email);
    formData.append('yeshivaName', additionalInfo.yeshivaName);
    formData.append('yearsOfStudy', additionalInfo.yearsOfStudy);
    formData.append('previousSchool', additionalInfo.previousSchool);
    formData.append('previousSchoolAddress', additionalInfo.previousSchoolAddress);
    formData.append('previousSchoolCity', additionalInfo.previousSchoolCity);
    formData.append('previousSchoolPhone', additionalInfo.previousSchoolPhone);
    formData.append('previousSchoolEmail', additionalInfo.previousSchoolEmail);
    formData.append('note', additionalInfo.note);
    formData.append('roshYeshivaName', additionalInfo.roshYeshivaName);
    formData.append('roshYeshivaPhone', additionalInfo.roshYeshivaPhone);
    
   
    if (form.idCardFile) {
      formData.append('idCardFile', form.idCardFile);
    }
    if (form.passportFile) {
      formData.append('passportFile', form.passportFile);
    }
    
    return this.http.post(`${this.apiUrl}/Students`, formData);
  }

  getPresignedUrl(folderName: string, fileName : string): Observable<any> {
    console.log(folderName + "folder name");
    return this.http.get(`${this.apiUrl}/upload/presigned-url`, {
      params: { folderName , fileName },
    });
  }
  createFolder( folderKey : string): Observable<any> {
    console.log(folderKey + "folder key");
    
    return this.http.post(`${this.apiUrl}/Documents`, 
      JSON.stringify(folderKey), 
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
  // שלב 2: העלאת הקובץ ל-S3
  uploadFileToS3(presignedUrl: string, file: File): Observable<any> {
    console.log('Uploading:', file.name, 'Type:', file.type);
    if (file.type !== 'image/jpeg') {
      alert('רק קבצי JPG מותרים!');
      return throwError(() => new Error('Invalid file type'));
    }
   
    return this.http.put(presignedUrl, file, {
      
      headers: { 'Content-Type': file.type },
    });
  }
}
