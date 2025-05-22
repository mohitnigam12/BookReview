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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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