import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterPayload {
  userName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(user: RegisterPayload): Observable<any> {
    console.log('Registering user:', user);
    return this.http.post(`${this.apiUrl}/user/register`, user, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        this.clearSession();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      this.clearSession();
      return false;
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.clearSession();
    }
  }

  private clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('lastActivity');
    }
  }

  getDecodedToken(): JwtPayload | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }
}
