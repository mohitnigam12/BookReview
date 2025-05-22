import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

interface JwtPayload {
  exp: number;
  username?: string;
  userName?: string;
  sub?: string;
  name?: string;
  nameid?: string;
  email?: string;
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
  private currentUserSubject: BehaviorSubject<string | null>;
  public currentUser: Observable<string | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentUserSubject = new BehaviorSubject<string | null>(this.getUsername());
    this.currentUser = this.currentUserSubject.asObservable();
    console.log('AuthService initialized. Initial username:', this.getUsername());
  }

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        console.log('Login response:', response); // Debug log
        if (response && response.token) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            console.log('Token stored in localStorage:', response.token); // Debug log
            const decoded = this.getDecodedToken();
            console.log('Decoded token after login:', decoded); // Debug log
            const username = this.getUsername();
            console.log('Username extracted after login:', username); // Debug log
            this.currentUserSubject.next(username);
            console.log('currentUserSubject updated with:', username); // Debug log
          }
        } else {
          console.error('Login response does not contain a token:', response);
        }
      })
    );
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
      this.currentUserSubject.next(null);
      console.log('Logged out. currentUserSubject set to null'); // Debug log
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
    if (!token) {
      console.log('No token found in localStorage'); // Debug log
      return null;
    }
    console.log(token , 'decoded by me');

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  getUsername(): string | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;

    const username = decoded['unique_name'] || decoded.username || decoded.userName || decoded.sub || null;
    console.log('Extracted username:', username, 'nameid (user ID):', decoded.nameid); // Debug log
    return username;
  }

  getEmail() : string | null {
    const decoded = this.getDecodedToken();
    if(!decoded) return null;
    const email = decoded.email || decoded.email || null;
    console.log(email , 'i found this');
    return email;
  }
}