import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Book } from '../../../models/book.model';
import { Review } from '../../../models/review.model';
import { BookService } from '../../../services/book.service';
import { ReviewService } from '../../../services/review.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule,
    CommonModule
  ],
  template: `
    <mat-card *ngIf="book()">
      <mat-card-title>{{ book()!.title }}</mat-card-title>
      <mat-card-subtitle>By {{ book()!.author }}</mat-card-subtitle>
      <mat-card-content>
        <p><strong>Genre:</strong> {{ book()!.genre || 'N/A' }}</p>
        <p><strong>Average Rating:</strong> {{ book()!.averageRating?.toFixed(1) || 'N/A' }}</p>
        <p><strong>Description:</strong> {{ book()!.description || 'No description available' }}</p>
      </mat-card-content>
    </mat-card>

    <div *ngIf="isAuthenticated()">
      <mat-form-field>
        <mat-label>Rating</mat-label>
        <mat-select (selectionChange)="addRating($event.value)">
          <mat-option *ngFor="let rating of [1,2,3,4,5]" [value]="rating">{{ rating }}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Write a Review</mat-label>
        <textarea matInput [(ngModel)]="reviewComment"></textarea>
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="addReview()">Submit Review</button>
    </div>

    <h3>Reviews</h3>
    <mat-card *ngFor="let review of reviews()">
      <mat-card-content>
        <p><strong>{{ review.userName }}</strong> ({{ review.createdAt | date }})</p>
        <p>Rating: {{ review.rating }}</p>
        <p>{{ review.comment }}</p>
      </mat-card-content>
    </mat-card>
    <mat-paginator
      [length]="totalReviews()"
      [pageSize]="pageSize"
      [pageSizeOptions]="[5, 10, 20]"
      (page)="onPageChange($event)">
    </mat-paginator>
  `,
  styles: [`
    mat-card { margin: 20px 0; }
    mat-form-field { width: 100%; margin-bottom: 20px; }
  `]
})
export class BookDetailsComponent {
  book = signal<Book | null>(null);
  reviews = signal<Review[]>([]);
  totalReviews = signal<number>(0);
  pageSize = 5;
  currentPage = 0;
  reviewComment = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private reviewService: ReviewService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBook(id);
    this.loadReviews(id);
  }

  isAuthenticated = () => !!localStorage.getItem('token');

  loadBook(id: number) {
    this.bookService.getBook(id).subscribe({
      next: (book) => this.book.set(book)
    });
  }

  loadReviews(bookId: number) {
    this.reviewService.getReviews(bookId, this.currentPage + 1, this.pageSize).subscribe({
      next: (res) => {
        this.reviews.set(res.reviews);
        this.totalReviews.set(res.total);
      }
    });
  }

  addRating(rating: number) {
    const book = this.book();
    if (!book || book.id === undefined) {
      alert('Book not loaded');
      return;
    }
    const bookId = book.id;
    this.reviewService.addRating(bookId, rating).subscribe({
      next: () => this.loadBook(bookId),
      error: () => alert('Failed to add rating')
    });
  }

  addReview() {
    if (!this.reviewComment.trim()) return;
    const book = this.book();
    if (!book || book.id === undefined) {
      alert('Book not loaded');
      return;
    }
    const bookId = book.id;
    this.reviewService.addReview({ bookId, comment: this.reviewComment }).subscribe({
      next: () => {
        this.reviewComment = '';
        this.loadReviews(bookId);
      },
      error: () => alert('Failed to add review')
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    const book = this.book();
    if (!book || book.id === undefined) {
      alert('Book not loaded');
      return;
    }
    this.loadReviews(book.id);
  }
}