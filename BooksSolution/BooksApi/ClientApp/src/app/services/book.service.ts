import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../enviroments/environment';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/api/Book`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  getBooks(page: number, pageSize: number): Observable<{ books: Book[], total: number }> {
    const url = `${this.apiUrl}/paged?pageNumber=${page}&pageSize=${pageSize}`;
    console.log(`Fetching books at: ${url}`);
    return this.http.get<{ Books: Book[], Total: number }>(url).pipe(
      tap(() => console.log(`Successfully called: ${url}`)),
      map(response => ({ books: response.Books, total: response.Total })),
      catchError((err) => {
        console.error(`Error fetching books at ${url}:`, err);
        return of({ books: [], total: 0 });
      })
    );
  }

  searchBooks(query: string): Observable<{ books: Book[], total: number }> {
    if (!query.trim()) {
      return this.getAllBooks().pipe(
        map(books => ({ books: books || [], total: books?.length || 0 })),
        catchError((err) => {
          console.error('Error fetching all books for empty query:', err);
          return of({ books: [], total: 0 });
        })
      );
    }
    const url = `${this.apiUrl}/search/${encodeURIComponent(query)}`;
    console.log(`Searching books at: ${url}`);
    return this.http.get<Book[]>(url).pipe(
      tap(() => console.log(`Successfully called: ${url}`)),
      map(books => ({ books: books || [], total: books?.length || 0 })),
      catchError((err) => {
        console.error(`Error searching books at ${url}:`, err);
        return of({ books: [], total: 0 });
      })
    );
  }

  getAllBooks(): Observable<Book[]> {
    const url = `${this.apiUrl}/get-all`;
    console.log(`Fetching all books at: ${url}`);
    return this.http.get<Book[]>(url).pipe(
      tap(() => console.log(`Successfully called: ${url}`)),
      catchError((err) => {
        console.error(`Error fetching all books at ${url}:`, err);
        return of([]);
      })
    );
  }

  addBook(book: Omit<Book, 'id' | 'averageRating'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error('Error adding book:', err);
        return throwError(() => new Error(`Failed to add book: ${err.message}`));
      })
    );
  }

   updateBook(id: number, book: Book): Observable<Book> {
    console.log('BookService: Updating book with ID:', id, 'Data:', book);
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error(`BookService: Error updating book ${id}:`, err);
        return throwError(() => new Error(`Failed to update book with ID ${id}: ${err.message}`));
      })
    );
  }

  getBooksByUserId(userId: string): Observable<{ books: Book[], total: number }> {
    const url = `${this.apiUrl}/user/${encodeURIComponent(userId)}`;
    console.log(`Fetching books for user at: ${url}`);
    return this.http.get<Book[]>(url, { headers: this.getAuthHeaders() }).pipe(
      tap(() => console.log(`Successfully called: ${url}`)),
      map(books => ({ books: books || [], total: books?.length || 0 })),
      catchError((err) => {
        console.error(`Error fetching books for user ${userId}:`, err);
        return of({ books: [], total: 0 });
      })
    );
  }

  // updateBook(id: number, book: Book): Observable<Book> {
  //   console.log('BookService: Updating book with ID:', id, 'Data:', book);
  //   return this.http.put<Book>(`${this.apiUrl}/${id}`, book, { headers: this.getAuthHeaders() }).pipe(
  //     catchError((err) => {
  //       console.error(`BookService: Error updating book ${id}:`, err);
  //       return throwError(() => new Error(`Failed to update book with ID ${id}: ${err.message}`));
  //     })
  //   );
  // }

  deleteBook(id: number): Observable<void> {
    console.log('BookService: Deleting book with ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.error(`BookService: Error deleting book ${id}:`, err);
        return throwError(() => new Error(`Failed to delete book with ID ${id}: ${err.message}`));
      })
    );
  }

  getBook(id: number): Observable<Book> {
    console.log('BookService: Fetching book with ID:', id);
    return this.http.get<Book>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.error(`BookService: Error loading book ${id}:`, err);
        return throwError(() => new Error(`Failed to load book with ID ${id}: ${err.message}`));
      })
    );
  }

  getBooksByCategory(categoryId: number): Observable<Book[]> {
    const url = `${this.apiUrl}/category?categoryId=${categoryId}`;
    console.log(`Fetching books by category at: ${url}`);
    return this.http.get<Book[]>(url).pipe(
      catchError((err) => {
        console.error(`Error fetching books for category ${categoryId}:`, err);
        return of([]);
      })
    );
  }
}