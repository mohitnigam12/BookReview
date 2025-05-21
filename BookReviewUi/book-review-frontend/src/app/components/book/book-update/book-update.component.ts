import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-update',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './book-update.component.html',
  styleUrls: ['./book-update.component.scss']
})
export class BookUpdateComponent {
  book = signal<Book | null>(null);
  error = signal<string | null>(null);
  bookForm: FormGroup;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: [''],
      description: ['']
    });

    if (!this.isAuthenticated()) {
      console.log('BookUpdateComponent: User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : NaN;
    console.log('BookUpdateComponent: ID from route:', idParam, 'Parsed ID:', id);
    if (isNaN(id) || id <= 0) {
      console.error('BookUpdateComponent: Invalid book ID:', idParam);
      this.error.set('Invalid book ID');
      this.router.navigate(['/books']);
      return;
    }

    this.bookService.getBook(id).subscribe({
      next: (book) => {
        console.log('BookUpdateComponent: Fetched book:', book);
        if (!book || !book.id) {
          console.error('BookUpdateComponent: Invalid book data:', book);
          this.error.set('Book not found');
          this.router.navigate(['/books']);
          return;
        }
        this.book.set(book);
        this.bookForm.patchValue({
          title: book.title,
          author: book.author,
          genre: book.genre || '',
          description: book.description || ''
        });
      },
      error: (err: any) => {
        console.error('BookUpdateComponent: Error loading book:', err);
        this.error.set('Failed to load book');
        this.router.navigate(['/books']);
      }
    });
  }

  isAuthenticated = () => {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      console.log('BookUpdateComponent: Checking authentication, token exists:', !!token);
      return !!token;
    }
    return false;
  };

  onSubmit() {
    console.log('BookUpdateComponent: Attempting to submit form, value:', this.bookForm.value);
    if (this.bookForm.invalid) {
      console.error('BookUpdateComponent: Form is invalid');
      this.error.set('Please fill in all required fields');
      return;
    }

    const book = this.book();
    if (!book || !book.id) {
      console.error('BookUpdateComponent: No book or invalid book ID');
      this.error.set('No valid book to update');
      this.router.navigate(['/books']);
      return;
    }

    const updatedBook: Book = {
      ...book,
      ...this.bookForm.value
    };

    this.bookService.updateBook(book.id, updatedBook).subscribe({
      next: (updated: Book) => {
        console.log('BookUpdateComponent: Book updated successfully:', updated);
        this.router.navigate(['/books', book.id]).catch(err => {
          console.error('BookUpdateComponent: Navigation error:', err);
        });
      },
      error: (err: any) => {
        console.error('BookUpdateComponent: Error updating book:', err);
        this.error.set('Failed to update book');
      }
    });
  }

  onCancel() {
    const book = this.book();
    const bookId = book?.id || '';
    console.log('BookUpdateComponent: Cancelling update, navigating to book ID:', bookId);
    this.router.navigate(['/books', bookId]).catch(err => {
      console.error('BookUpdateComponent: Navigation error:', err);
    });
  }
}