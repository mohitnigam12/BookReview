import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { Review } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getReviews(bookId: number, page: number, pageSize: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<{ reviews: Review[]; total: number }>(`${this.apiUrl}/api/reviews/book/${bookId}`, { params });
  }

  addReview(review: Partial<Review>) {
    return this.http.post<Review>(`${this.apiUrl}/api/reviews`, review, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  addRating(bookId: number, rating: number) {
    return this.http.post(`${this.apiUrl}/api/ratings`, { bookId, rating }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }
}
