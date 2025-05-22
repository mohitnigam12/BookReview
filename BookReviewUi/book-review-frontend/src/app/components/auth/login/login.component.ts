import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
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
    <div class="login-container">
      <div class="login-card">
        <div class="heading-wrapper">
          <img src="https://plus.unsplash.com/premium_photo-1669652639356-f5cb1a086976?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Books Review World Logo" class="logo" />
          <h2>Welcome to Books Review World</h2>
        </div>
        <p class="card-subtitle">Login to explore Books Review, share insights, and rate your favorite reads!</p>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" required placeholder="Enter your username">
            <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
              Username is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" required placeholder="Enter your password">
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">
            Login
          </button>

          <div class="register-link">
            <p>Don't have an account? <a routerLink="/register">Register here</a></p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: url('https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') no-repeat center center/cover;
      position: relative;
    }

    .login-container::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 0;
    }

    .login-card {
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
      margin-bottom: 8px;
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

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }

    input {
      color: #333 !important;
    }

    input::placeholder {
      color: #999 !important;
      opacity: 0.9;
    }
    mat-label, mat-icon {
      color: #666 !important;
    }
   

    mat-error {
      font-size: 0.85rem;
      color: #e63946;
      padding-top: 4px;
    }

    button {
      padding: 12px;
      font-size: 16px;
    }

    .register-link {
      text-align: center;
      margin-top: 16px;
      font-size: 0.95rem;
    }

    .register-link a {
      color: #3b82f6;
      text-decoration: none;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 576px) {
      .login-card {
        padding: 20px;
        max-width: 90%;
      }

      h2 {
        font-size: 1.6rem;
      }

      .card-subtitle {
        font-size: 0.9rem;
      }

      button {
        padding: 10px;
        font-size: 14px;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('lastActivity', Date.now().toString());
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Login error:', err);
          alert('Login failed: ' + (err.error?.message || 'Server error'));
        }
      });
    }
  }
}