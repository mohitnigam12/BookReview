import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../enviroments/environment';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/api/books`;

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
    return this.http.post(`${this.apiUrl}/${bookId}/reviews`, review, { headers: this.getAuthHeaders() });
  }

  getReviewsByBookId(bookId: number): Observable<Review[]> {
    return this.http.get<{ averageRating: number; reviews: Review[] }>(`${this.apiUrl}/${bookId}/reviews`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.reviews || []),
      tap(reviews => console.log('Fetched reviews for book', bookId, ':', reviews))
    );
  }

  hasUserReviewed(bookId: number): Observable<{ hasReviewed: boolean }> {
    return this.http.get<{ hasReviewed: boolean }>(`${this.apiUrl}/${bookId}/reviews/user`, {
      headers: this.getAuthHeaders()
    });
  }
}