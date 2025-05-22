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
    templateUrl:'./register.Component.html' ,
    styleUrls: ['./register.component.scss']
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