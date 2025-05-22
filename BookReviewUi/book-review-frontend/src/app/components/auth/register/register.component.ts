import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        CommonModule,
        RouterLink
    ],
    template: `
    <div class="register-container">
      <div class="register-card">
        <div class="heading-wrapper">
          <img src="https://plus.unsplash.com/premium_photo-1667251758769-398dca4d5f1c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="BookVerse Logo" class="logo" />
          <h2>Join Books Review</h2>
        </div>
          <p class="card-subtitle">Register to explore Books Review, share insights, and rate your favorite reads!</p>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input matInput formControlName="userName" required>
            <mat-error *ngIf="registerForm.get('userName')?.hasError('required')">
              Username is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" required>
            <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
              Enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" required>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
              Password must be at least 6 characters
            </mat-error>
            <mat-error *ngIf="registerForm.get('password')?.hasError('pattern')">
              Password must contain at least one number and one special character
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirm Password</mat-label>
            <input matInput formControlName="confirmPassword" [type]="hideConfirmPassword ? 'password' : 'text'" required>
            <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button">
              <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
              Confirm Password is required
            </mat-error>
            <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('mismatch')">
              Passwords do not match
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid">
            Register
          </button>

          <p>Already have an account? <a routerLink="/login">Login here</a></p>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: url('https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') no-repeat center center/cover;
      position: relative;
       font-family: 'Ancizar Serif', serif;
    }

    .register-container::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 0;
    }

    .register-card {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .heading-wrapper {
      text-align: center;   
      margin-bottom: 16px;
    }

    .logo {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid rgba(224, 29, 29, 0.84);
      box-shadow: 0 2px 8px rgba(209, 160, 160, 0.15);
      margin-bottom: 8px;
    }

    h2 {
      text-align: center;
      margin-bottom: 16px;
      font-size: 1.8rem;
      color: #333;
       font-family: 'Ancizar Serif', serif;
    }

    .card-subtitle {
      font-size: 1rem;
      text-align: center;
      margin-bottom: 16px;
      color: #666;
       font-family: 'Ancizar Serif', serif;
    }


    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    button {
      padding: 12px;
      font-size: 16px;
    }

    p {
      text-align: center;
      margin-top: 16px;
       font-family: 'Ancizar Serif', serif;
    }

    a {
      color: #3b82f6;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
    registerForm: FormGroup;
    hidePassword = true;
    hideConfirmPassword = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            userName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [
                Validators.required,
                Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).*$/)
            ]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.registerForm.valid) {
            const { userName, email, password } = this.registerForm.value;
            this.authService.register({ userName, email, password }).subscribe({
                next: (response) => {
                    console.log('Registration successful:', response);
                    this.router.navigate(['/login']);
                    alert('Registration successful! Please log in.');
                },
                error: (err) => {
                    console.error('Registration error:', err);
                    alert('Registration failed: ' + (err.error?.message || 'Server error'));
                }
            });
        }
    }
}