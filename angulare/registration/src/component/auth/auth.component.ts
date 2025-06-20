import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormService } from '../../services/form.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  isLoading = false;
  
  generateStudentFolderName(firstName: string, lastName: string): string {
    const cleanFirst = firstName.trim().replace(/\s+/g, '_');
    const cleanLast = lastName.trim().replace(/\s+/g, '_');
    const uniqueId = Date.now(); 
    return `${cleanFirst}_${cleanLast}_${uniqueId}`;
  }
  
  registrationForm: FormGroup;
  selectedIdCardFileName: string = '';
  selectedPassportFileName: string = '';
  s3UploadUrl = 'https://your-s3-bucket-url.com/upload'; 
  
  ngOnInit(): void { }

  constructor(
    private fb: FormBuilder, 
    private formService: FormService, 
    private snackBar: MatSnackBar, 
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'error',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/error.svg')
    );
    
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      idCardFile: [null, Validators.required],
      passportFile: [null, Validators.required],
      kohenLeviIsrael: ['', [Validators.required]],
      identityNumber: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      countryOfBirth: ['', [Validators.required]],
      hebrewDateOfBirth: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      buildingNumber: ['', [Validators.required]],
      healthInsurance: ['', [Validators.required]],

      additionalInfo: this.fb.group({
        fatherName: ['', [Validators.required]],
        fatherPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        fatherCountryOfOrigin: ['', []],
        fatherOccupation: ['', [Validators.required]],
        motherName: ['', [Validators.required]],
        motherLastName: ['', [Validators.required]],
        motherPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        motherCountryOfOrigin: ['', []],
        motherOccupation: ['', [Validators.required]],
        email: ['', [Validators.email]],
        yeshivaName: ['', [Validators.required]],
        yearsOfStudy: ['', [Validators.required]],
        previousSchoolCity: ['', [Validators.required]],
        previousSchoolPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        previousSchoolAddress: ['', [Validators.required]],
        previousSchoolEmail: ['', [Validators.email]],
        roshYeshivaName: ['', [Validators.required]],
        roshYeshivaPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        note: ['', []],
      }),
    });
  }

  // פונקציה חדשה לבדיקת שגיאות שדה
  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'שדה חובה';
      if (field.errors['pattern']) return 'פורמט לא תקין';
      if (field.errors['email']) return 'כתובת אימייל לא תקינה';
    }
    return '';
  }

  // פונקציה לבדיקת שגיאות בשדות מקוננים
  getNestedFieldError(groupName: string, fieldName: string): string {
    const field = this.registrationForm.get(`${groupName}.${fieldName}`);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'שדה חובה';
      if (field.errors['pattern']) return 'פורמט לא תקין';
      if (field.errors['email']) return 'כתובת אימייל לא תקינה';
    }
    return '';
  }

  // פונקציה לקפיצה לשדה הראשון עם שגיאה
  scrollToFirstError(): void {
    const firstErrorField = document.querySelector('.mat-form-field-invalid');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
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

  showSuccessMessage() {
    Swal.fire({
      title: 'הטופס נשלח בהצלחה',
      icon: 'success',
      confirmButtonText: 'סגור',
      allowOutsideClick: true,
      allowEscapeKey: true,
      showClass: {
        popup: 'swal2-noanimation',
      },
      customClass: {
        popup: 'swal2-draggable',
      }
    }).then(() => {
      window.location.reload();
    });
  }
  
  alert = {
    open: false,
    message: '',
    severity: 'error'
  };
  
  showAlert(message: string) {
    this.alert.message = message;
    this.alert.open = true;
    setTimeout(() => {
      this.closeAlert();
    }, 5000);
  }
  
  closeAlert() {
    this.alert.open = false;
  }
  
  handleUpload(fileType: 'idCard' | 'passport', folderName: string) {
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

    const fileName = fileType === 'idCard' ? 'id-card.jpg' : 'passport.jpg';

    this.formService.getPresignedUrl(folderName, fileName).subscribe({
      next: (response) => {
        const presignedUrl = response.url;

        this.formService.uploadFileToS3(presignedUrl, selectedFile!).subscribe({
          next: () => {
          },
          error: (err) => {
            this.showAlert('אירעה שגיאה בהעלאת הקובץ.');
            console.error('שגיאה בהעלאת הקובץ:', err);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.showAlert('אירעה שגיאה בקבלת URL.');
        console.error('שגיאה בקבלת URL:', err);
      }
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      const firstName = this.registrationForm.get('firstName')?.value;
      const lastName = this.registrationForm.get('lastName')?.value;

      const folderName = this.generateStudentFolderName(firstName, lastName);

      this.formService.login(this.registrationForm.value, folderName).subscribe(
        (response) => {
          this.isLoading = false;
          this.showSuccessMessage();
          this.handleUpload('idCard', folderName);
          this.handleUpload('passport', folderName);
        },
        (error) => {
          this.isLoading = false;
          this.showAlert('אירעה שגיאה נסו שנית!');
          console.error('Login failed', error);
        }
      );
    } else {
      // סימון כל השדות כ-touched כדי להציג שגיאות
      this.markFormGroupTouched(this.registrationForm);
      this.scrollToFirstError();
      this.showAlert('נא למלא את כל השדות הנדרשים');
    }
  }

  // פונקציה לסימון כל השדות כ-touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}