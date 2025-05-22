import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { ReviewService } from '../../../services/review.service';
import { Book } from '../../../models/book.model';
import { Review } from '../../../models/review.model';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent {
  book = signal<Book | null>(null);
  reviews = signal<Review[]>([]);
  error = signal<boolean>(false);

  constructor(
    private bookService: BookService,
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : NaN;
    console.log('BookDetailsComponent: ID from route:', idParam, 'Parsed ID:', id);
    if (isNaN(id) || id <= 0) {
      console.error('BookDetailsComponent: Invalid book ID:', idParam);
      this.error.set(true);
      this.router.navigate(['/books']);
      return;
    }

    // Load book details
    this.bookService.getBook(id).subscribe({
      next: (book: Book) => {
        console.log('BookDetailsComponent: Fetched book:', book);
        if (!book || !book.id) {
          console.error('BookDetailsComponent: Invalid book data:', book);
          this.error.set(true);
          this.router.navigate(['/books']);
          return;
        }
        this.book.set(book);
      },
      error: (err) => {
        console.error('BookDetailsComponent: Error loading book:', err);
        this.error.set(true);
        this.router.navigate(['/books']);
      }
    });

    // Load reviews
    this.reviewService.getReviewsByBookId(id).subscribe({
      next: (reviews: Review[]) => {
        console.log('BookDetailsComponent: Setting reviews:', reviews);
        this.reviews.set(reviews);
      },
      error: (err) => {
        console.error('BookDetailsComponent: Error loading reviews:', err);
        this.reviews.set([]);
      }
    });
  }

  isAuthenticated = () => {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      console.log('BookDetailsComponent: Checking authentication, token exists:', !!token);
      return !!token;
    }
    return false;
  };

  navigateToUpdate(bookId: number) {
    console.log('BookDetailsComponent: Navigating to update for book ID:', bookId);
    this.router.navigate(['/books', bookId, 'updateBook']).catch(err => {
      console.error('BookDetailsComponent: Navigation error:', err);
    });
  }

  onDeleteBook(): void {
    const book = this.book();
    console.log('BookDetailsComponent: Attempting to delete book:', book);
    if (!book || !book.id) {
      console.error('BookDetailsComponent: No book or invalid book ID');
      this.error.set(true);
      return;
    }
    if (!this.isAuthenticated()) {
      console.error('BookDetailsComponent: User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(book.id).subscribe({
        next: () => {
          console.log(`BookDetailsComponent: Book with ID ${book.id} deleted successfully`);
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('BookDetailsComponent: Error deleting book:', err);
          this.error.set(true);
        }
      });
    }
  }
}