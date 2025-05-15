// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { BookDetailsComponent } from './components/book/book-details/book-details.component';
import { BookFormComponent } from './components/book/book-form/book-form.component';
import { LoginComponent } from './components/auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: BookListComponent },
  { path: 'books/:id', component: BookDetailsComponent },
  { path: 'books/add', component: BookFormComponent },
  { path: 'login', component: LoginComponent }
];