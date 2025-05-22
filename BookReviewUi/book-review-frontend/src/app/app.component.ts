import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span class="app-title">📚 Book Review App</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/books" class="nav-button books-button">
        <mat-icon class="nav-icon">menu_book</mat-icon>
        Books
      </button>
      <ng-container *ngIf="authService.isAuthenticated(); else notLoggedIn">
        <span class="nav-button logged-in-indicator">
          <mat-icon class="nav-icon">check_circle_outline</mat-icon>
           Welcome Back {{ username || 'Logged In' }} 
        </span>
        <button mat-button (click)="logout()" class="nav-button logout-button">
          <mat-icon class="nav-icon">exit_to_app</mat-icon> Logout
        </button>
      </ng-container>
      <ng-template #notLoggedIn>
        <button mat-button routerLink="/login" class="nav-button login-button">
          Login
        </button>
        <button mat-button routerLink="/register" class="nav-button login-button">
          Register
        </button>
      </ng-template>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    mat-toolbar {
      padding: 0 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
     // margin-bottom: 20px;
      background: linear-gradient(90deg, #3f51b5 0%, #5c6bc0 100%);
      font-family: 'Roboto', sans-serif;
    }

    .app-title {
      font-size: 22px;
      font-weight: 600;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .nav-button {
      margin: 0 8px;
      padding: 6px 16px; /* Consistent padding for all buttons */
      color: #ffffff;
      font-weight: 500;
      font-size: 14px; /* Consistent font size */
      line-height: 32px; /* Consistent height */
      height: 32px; /* Fixed height for uniformity */
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 16px; /* Slightly smaller radius for balance */
      transition: background-color 0.3s ease, transform 0.1s ease;
      border: 1px solid transparent; /* Placeholder for border styling */
    }

    .nav-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: scale(1.05);
    }

    .books-button {
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .books-button:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }

    .logged-in-indicator {
      background-color: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .logged-in-indicator:hover {
      background-color: rgba(255, 255, 255, 0.25);
      transform: scale(1.05);
    }

    .nav-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
      color: #e8f0fe;
    }

    .logout-button {
      background-color:rgb(218, 55, 110);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .login-button{
       background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .logout-button:hover {
      background-color: #f50057;
      transform: scale(1.05);
    }
  `]
})
export class AppComponent implements OnInit {
  username: string | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Direct call to getUsername
    const directUsername = this.authService.getUsername();
    console.log('Direct call to getUsername at', new Date().toISOString(), ':', directUsername);

    // Existing subscription to currentUser
    this.authService.currentUser.subscribe(username => {
      console.log('AppComponent received username update via subscription at', new Date().toISOString(), ':', username);
      this.username = username;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/books']);
  }
}