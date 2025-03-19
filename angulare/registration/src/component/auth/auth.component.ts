import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
    MatButtonModule,],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  registrationForm: FormGroup;
  submitted = false;

  ngOnInit(): void {}
  
  constructor(private fb: FormBuilder) { 
    this.registrationForm = this.fb.group({
      lastName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      kohenLeviIsrael: ['', [Validators.required]],
      identityNumber: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      address: ['', [Validators.required]],
      buildingNumber: ['', [Validators.required]],
      city: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      countryOfBirth: ['', [Validators.required]],
      healthInsurance: ['', [Validators.required]],
      hebrewDateOfBirth: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      fatherName: ['', [Validators.required]],
      fatherPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      fatherCountryOfOrigin: ['', [Validators.required]],
      motherName: ['', [Validators.required]],
      motherLastName: ['', [Validators.required]],
      motherPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      motherCountryOfOrigin: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      fatherOccupation: ['', [Validators.required]],
      motherOccupation: ['', [Validators.required]],
      yeshivaName: ['', [Validators.required]],
      yearsOfStudy: ['', [Validators.required]],
      previousSchool: ['', [Validators.required]],
      previousSchoolAddress: ['', [Validators.required]],
      previousSchoolCity: ['', [Validators.required]],
      previousSchoolPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      previousSchoolFax: ['', [Validators.required]],
      previousSchoolEmail: ['', [Validators.required, Validators.email]]
    });
  }

  get formControls() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    this.submitted = true; // מכניס את המשתנה כ"נשלח" כאשר הוגש הטופס

    // אם הטופס לא תקין, אין למה להמשיך
    if (this.registrationForm.invalid) {
      return;
    }

    // כאן תוכל להוסיף את הלוגיקה לשליחה (למאגרים, API, וכו')
    console.log('טופס נשלח בהצלחה!', this.registrationForm.value);
  }
}
