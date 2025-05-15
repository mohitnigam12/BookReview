import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../enviroments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  token = signal<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  register(user: User) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/api/auth/register`, user);
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/api/auth/login`, credentials);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.token.set(token);
  }
}