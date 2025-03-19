import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  email: string = '';
  password: string = '';
    loginForm: FormGroup;
  
    constructor(private fb: FormBuilder, private router: Router) {
      this.loginForm = this.fb.group({
        // email: ['', [Validators.required, Validators.email]],
        // password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
    ngOnInit() {
    }
  
    onSubmit() {
      // if (this.loginForm.valid) {
      //   this.authService.login(userData).subscribe(
      //     (response) => {
      //       this.authService.storeToken(response.token); // שמירת הטוקן
            this.router.navigate(['/auth']);
      //     },
      //     (error) => {
      //       console.error('Login failed', error);
      //     }
      //   );
      // }
    }
}
