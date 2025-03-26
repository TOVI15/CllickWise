import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from 'express';
import { FormService } from '../../services/form.service';
import { MatIconModule } from '@angular/material/icon';
 
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ 
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  registrationForm: FormGroup;
  selectedIdCardFileName: string = '';
  selectedPassportFileName: string = '';
  s3UploadUrl = 'https://your-s3-bucket-url.com/upload'; // כתובת API להעלאת קובץ ל-S3
  ngOnInit(): void {}
    constructor(private fb: FormBuilder , private formService: FormService) { 
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      paymentMethod: ['', Validators.required] ,
      idCardFile: [null, Validators.required],  
      passportFile: [null, Validators.required],
      // passportFile: ["", Validators.required],
      // kohenLeviIsrael: ['', [Validators.required]],
      // identityNumber: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      // address: ['', [Validators.required]],
      // buildingNumber: ['', [Validators.required]],
      // city: ['', [Validators.required]],
      // phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      // countryOfBirth: ['', [Validators.required]],
      // healthInsurance: ['', [Validators.required]],
      // hebrewDateOfBirth: ['', [Validators.required]],
      // dateOfBirth: ['', [Validators.required]],
      // fatherName: ['', [Validators.required]],
      // fatherPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      // fatherCountryOfOrigin: ['', [Validators.required]],
      // motherName: ['', [Validators.required]],
      // motherLastName: ['', [Validators.required]],
      // motherPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      // motherCountryOfOrigin: ['', [Validators.required]],
      // motherOccupation: ['', [Validators.required]],
      // email: ['', [ Validators.email]],
      // fatherOccupation: ['', [Validators.required]],
      // yeshivaName: ['', [Validators.required]],
      // yearsOfStudy: ['', [Validators.required]],
      // previousSchool: ['', [Validators.required]],
      // previousSchoolAddress: ['', [Validators.required]],
      // previousSchoolCity: ['', [Validators.required]],
      // previousSchoolPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      // previousSchoolFax: ['', []],
      // previousSchoolEmail: ['', [Validators.email]],
      note: ['', []],
      // paymentMethod: ['', [Validators.required]],
    });
  }
  
  onIdCardChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.selectedIdCardFileName = file.name;
      this.registrationForm.patchValue({ idCardFile: file });
      this.registrationForm.get('idCardFile')?.updateValueAndValidity();
    }
  }
  
  onPassportChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.selectedPassportFileName = file.name;
      this.registrationForm.patchValue({ passportFile: file });
      this.registrationForm.get('passportFile')?.updateValueAndValidity();
    }
  }

  // onFileChange(event: any) {
  //   if (event.target.files && event.target.files[0]) {
  //     this.selectedIdCardFileName = event.target.files[0];
  //     this.registrationForm.patchValue({ file: this.selectedIdCardFileName }) 
  //   }
  // }

  handleUpload(fileType: 'idCard' | 'passport') {
    let selectedFile: File | null = null;
  
    if (fileType === 'idCard') {
      selectedFile = this.registrationForm.get('idCardFile')?.value;
    } else if (fileType === 'passport') {
      selectedFile = this.registrationForm.get('passportFile')?.value;
    }
  
    if (!selectedFile) {
      alert('נא לבחור קובץ לפני ההעלאה.');
      return;
    }
  
    this.formService.getPresignedUrl(selectedFile.name).subscribe({
      next: (response) => {
        const presignedUrl = response.url;
  
        // העלאת הקובץ ל-S3
        this.formService.uploadFileToS3(presignedUrl, selectedFile!).subscribe({
          next: () => {
            alert(`הקובץ ${fileType === 'idCard' ? 'תעודת זהות' : 'דרכון'} הועלה בהצלחה!`);
          },
          error: (err) => {
            console.error('שגיאה בהעלאה:', err);
          },
        });
      },
      error: (err) => {
        console.error('שגיאה בקבלת URL:', err);
      },
    });
  } 

  onSubmit() {
    if (this.registrationForm.valid) {
    console.log('טופס נשלח בהצלחה!', this.registrationForm.value);
    this.handleUpload('idCard');
    this.handleUpload('passport');
      this.formService.login(this.registrationForm.value).subscribe(
        (response) => {
          console.log("start");
          
          console.log('Login successful', response);
          // this.router.navigate(['/courses']);
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    }
  }
}
