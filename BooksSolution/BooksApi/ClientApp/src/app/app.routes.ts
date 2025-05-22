import { Routes } from '@angular/router';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { BookDetailsComponent } from './components/book/book-details/book-details.component';
import { BookFormComponent } from './components/book/book-form/book-form.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ReviewAddComponent } from './components/review-add/review-add.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { BookUpdateComponent } from './components/book/book-update/book-update.component';


export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: BookListComponent },
   { path: 'books/add', component: BookFormComponent },
  { path: 'books/:id', component: BookDetailsComponent },
  { path: 'books/:id/reviews/add', component: ReviewAddComponent },
  {path : 'books/:id/updateBook',component:BookUpdateComponent},
  { path: 'login', component: LoginComponent },
   { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/books' }
];