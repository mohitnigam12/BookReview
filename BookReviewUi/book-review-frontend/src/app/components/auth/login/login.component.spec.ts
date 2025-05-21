import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        CommonModule,
        RouterLink,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with username and password controls', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.get('username')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should disable submit button when form is invalid', () => {
    const submitButton = fixture.debugElement.query(By.css('.login-button')).nativeElement;
    expect(submitButton.disabled).toBeTrue();

    component.loginForm.setValue({ username: 'testuser', password: 'testpass' });
    fixture.detectChanges();
    expect(submitButton.disabled).toBeFalse();
  });

  it('should call authService.login and navigate on successful login', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'fake-token' }));
    component.loginForm.setValue({ username: 'testuser', password: 'testpass' });

    component.onSubmit();
    fixture.detectChanges();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ username: 'testuser', password: 'testpass' });
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/books']);
  });

  it('should show alert on login failure', () => {
    const alertSpy = spyOn(window, 'alert');
    authServiceSpy.login.and.returnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));
    component.loginForm.setValue({ username: 'testuser', password: 'testpass' });

    component.onSubmit();
    fixture.detectChanges();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Login failed: Invalid credentials');
  });

  it('should toggle password visibility', () => {
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]')).nativeElement;
    const toggleButton = fixture.debugElement.query(By.css('button[mat-icon-button]')).nativeElement;

    expect(component.hidePassword).toBeTrue();
    expect(passwordInput.type).toBe('password');

    toggleButton.click();
    fixture.detectChanges();

    expect(component.hidePassword).toBeFalse();
    expect(passwordInput.type).toBe('text');
  });
});