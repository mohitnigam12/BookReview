import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Added for HttpClient
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, CommonModule, HttpClientModule],
  template: `
    <mat-toolbar color="primary">
      <span>Book Review App</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/login" *ngIf="!isAuthenticated()">Login</button>
      <button mat-button (click)="logout()" *ngIf="isAuthenticated()">Logout</button>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`.spacer { flex: 1 1 auto; }`]
})
export class AppComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isAuthenticated = () => {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  };

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      window.location.reload();
    }
  }
}