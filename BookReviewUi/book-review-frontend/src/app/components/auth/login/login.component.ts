import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <mat-label>Username</mat-label>
        <input matInput formControlName="username" type="text">
        <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
          Username is required
        </mat-error>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Password</mat-label>
        <input matInput formControlName="password" type="password">
        <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
          Password is required
        </mat-error>
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">Login</button>
    </form>
  `
})
export class LoginComponent {
  loginForm: FormGroup;

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
    console.log('Form submitted', this.loginForm.value, 'Valid:', this.loginForm.valid);
    if (this.loginForm.valid) {
      const formValue: { username: string; password: string } = this.loginForm.value as {
        username: string;
        password: string;
      };
      console.log('Sending login request:', formValue);
      this.authService.login(formValue).subscribe({
        next: (res) => {
          console.log('Login successful', res);
          this.authService.setToken(res.token);
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Login error:', err);
          alert('Login failed: ' + (err.error?.message || 'Unauthorized'));
        }
      });
    } else {
      console.log('Form invalid, errors:', this.loginForm.errors);
    }
  }
}