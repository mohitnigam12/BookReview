import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { Book } from '../models/book.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = `${environment.apiUrl}/api/Book`;

  constructor(private http: HttpClient) {}

  getBooks(page: number, pageSize: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<{ books: Book[]; total: number }>(`${this.apiUrl}/get-all`, { params });
  }

  searchBooks(query: string, page: number, pageSize: number) {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<{ books: Book[]; total: number }>(`${this.apiUrl}/api/books/search`, { params });
  }

  getBook(id: number) {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

   addBook(book: Omit<Book, 'id' | 'averageRating'>) {
    return this.http.post<Book>(`${this.apiUrl}`, book, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    
}
getAllBooks(): Observable<Book[]> {
       return this.http.get<Book[]>(`${this.apiUrl}/get-all`);
     }

}
