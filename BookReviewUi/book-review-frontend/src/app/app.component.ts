import { Component } from '@angular/core';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
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
    CommonModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Book Review App</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/books">Books</button>
      <button mat-button *ngIf="!authService.isAuthenticated()" routerLink="/login">Login</button>
      <button mat-button *ngIf="!authService.isAuthenticated()" routerLink="/register">Register</button>
      <button mat-button *ngIf="authService.isAuthenticated()" (click)="logout()">Logout</button>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    mat-toolbar { margin-bottom: 20px; }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/books']);
  }
}