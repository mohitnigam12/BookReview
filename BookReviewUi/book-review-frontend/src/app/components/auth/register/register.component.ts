import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
    animations: [
        trigger('fadeIn', [
            state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
            transition(':enter', [
                animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ])
    ],
    template: `
    <div class="register-container">
      <div class="overlay"></div>
      <div class="register-card" @fadeIn>
        <div class="image-wrapper">
          <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80" alt="Books" />
        </div>
        <h2 class="card-title">Create Your Account</h2>
        <p class="card-subtitle">Join BookVerse and share your love for books!</p>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput formControlName="userName" required placeholder="Enter your username">
            <mat-icon matPrefix>person</mat-icon>
            <mat-error *ngIf="registerForm.get('userName')?.hasError('required')">
              Username is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" required placeholder="Enter your email">
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
              Enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" required placeholder="Enter your password">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
              Password must be at least 6 characters
            </mat-error>
            <mat-error *ngIf="registerForm.get('password')?.hasError('pattern') && registerForm.get('password')?.touched">
              Password must contain at least one number and one special character.
            </mat-error>

          </mat-form-field>

          <button type="submit" class="register-button" [disabled]="registerForm.invalid">
            Register
          </button>

          <div class="login-link">
            <p>Already have an account? <a routerLink="/login">Login here</a></p>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .register-container {
      position: relative;
      min-height: 100vh;
      background: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 0;
    }

    .register-card {
      position: relative;
      z-index: 1;
      max-width: 420px;
      width: 100%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 16px;
      padding: 32px 24px;
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      color: #fff;
    }

    .image-wrapper img {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      display: block;
      margin: 0 auto 12px auto;
    }

    .card-title {
      font-size: 1.8rem;
      font-weight: 600;
      text-align: center;
      margin-bottom: 6px;
    }

    .card-subtitle {
      font-size: 0.95rem;
      text-align: center;
      margin-bottom: 24px;
      color: #ddd;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      margin-bottom:10px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
    }

    input {
      color: #fff !important;
    }

    mat-label, mat-icon {
      color: #ccc !important;
    }

    mat-error {
      font-size: 0.8rem;
      color:rgb(233, 196, 224);
    }

    .register-button {
      background: linear-gradient(to right, #00c6ff, #0072ff);
      color: white;
      margin:10px;
      padding: 12px;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: bold;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
    }

    .register-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }

    .register-button:disabled {
      background-color: #999999;
      cursor: not-allowed;
    }

    .login-link {
      text-align: center;
      margin-top: 16px;
      font-size: 0.9rem;
    }

    .login-link a {
      color: #00c6ff;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 576px) {
      .register-card {
        padding: 24px 16px;
      }

      .card-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class RegisterComponent {
    registerForm: FormGroup;
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            userName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).*$/)]]
        });
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