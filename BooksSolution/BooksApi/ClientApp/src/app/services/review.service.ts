import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../enviroments/environment';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/api`; 
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  addReview(bookId: number, review: { rating: number; comment: string }): Observable<any> {
    console.log('Sending review to API:', review, 'for book ID:', bookId);
    return this.http.post(`${this.apiUrl}/books/${bookId}/reviews`, review, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error(`Error adding review for book ${bookId}:`, err);
        return throwError(() => new Error(err.error?.message || `Failed to add review for book ${bookId}`));
      })
    );
  }

  getReviewsByBookId(bookId: number): Observable<Review[]> {
    return this.http.get<{ averageRating: number; reviews: Review[] }>(`${this.apiUrl}/books/${bookId}/reviews`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.reviews || []),
      tap(reviews => console.log('Fetched reviews for book', bookId, ':', reviews)),
      catchError((err) => {
        console.error(`Error fetching reviews for book ${bookId}:`, err);
        return throwError(() => new Error(err.error?.message || `Failed to fetch reviews for book ${bookId}`));
      })
    );
  }

  hasUserReviewed(bookId: number): Observable<{ hasReviewed: boolean }> {
    return this.http.get<{ hasReviewed: boolean }>(`${this.apiUrl}/books/${bookId}/reviews/user`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((err) => {
        console.error(`Error checking if user has reviewed book ${bookId}:`, err);
        return throwError(() => new Error(err.error?.message || `Failed to check if user has reviewed book ${bookId}`));
      })
    );
  }

  updateReview(reviewId: number, reviewData: { rating: number; comment: string }): Observable<void> {
    const url = `${this.apiUrl}/Review/${reviewId}`;
    console.log(`Updating review ${reviewId} at: ${url}`);
    return this.http.put<void>(url, reviewData, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error(`Error updating review ${reviewId}:`, err);
        return throwError(() => new Error(err.error?.message || `Failed to update review with ID ${reviewId}`));
      })
    );
  }

   deleteReview(bookId: number, reviewId: number): Observable<void> {
    const url = `https://localhost:7108/api/books/${bookId}/reviews/${reviewId}`; 
    console.log(`Deleting review ${reviewId} for book ${bookId} at: ${url}`);
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error(`Error deleting review ${reviewId} for book ${bookId}:`, err);
        return throwError(() => new Error(err.error?.message || `Failed to delete review with ID ${reviewId} for book ${bookId}`));
      })
    );
  }
}