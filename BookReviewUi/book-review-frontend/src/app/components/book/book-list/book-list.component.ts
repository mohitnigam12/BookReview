import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
   import { MatButtonModule } from '@angular/material/button';
   import { MatFormFieldModule } from '@angular/material/form-field';
   import { MatInputModule } from '@angular/material/input';
   import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
   import { MatTableModule } from '@angular/material/table';
   import { RouterLink } from '@angular/router';
   import { CommonModule } from '@angular/common';
   import { isPlatformBrowser } from '@angular/common';
   import { Book } from '../../../models/book.model';
   import { BookService } from '../../../services/book.service';
import { HttpClientModule } from '@angular/common/http';

   @Component({
     selector: 'app-book-list',
     standalone: true,
     imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatFormFieldModule, MatInputModule, RouterLink, CommonModule , HttpClientModule],
     template: `
       <mat-form-field>
         <mat-label>Search</mat-label>
         <input matInput (input)="search($event)" placeholder="Search by title, author, or genre">
       </mat-form-field>
       <table mat-table [dataSource]="books()">
         <ng-container matColumnDef="title">
           <th mat-header-cell *matHeaderCellDef>Title</th>
           <td mat-cell *matCellDef="let book">{{ book.title }}</td>
         </ng-container>
         <ng-container matColumnDef="author">
           <th mat-header-cell *matHeaderCellDef>Author</th>
           <td mat-cell *matCellDef="let book">{{ book.author }}</td>
         </ng-container>
         <ng-container matColumnDef="genre">
           <th mat-header-cell *matHeaderCellDef>Genre</th>
           <td mat-cell *matCellDef="let book">{{ book.genre || 'N/A' }}</td>
         </ng-container>
         <ng-container matColumnDef="rating">
           <th mat-header-cell *matHeaderCellDef>Average Rating</th>
           <td mat-cell *matCellDef="let book">{{ book.averageRating?.toFixed(1) || 'N/A' }}</td>
         </ng-container>
         <ng-container matColumnDef="actions">
           <th mat-header-cell *matHeaderCellDef>Actions</th>
           <td mat-cell *matCellDef="let book">
             <button mat-button [routerLink]="['/books', book.id]">View Details</button>
           </td>
         </ng-container>
         <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
         <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
       </table>
       <mat-paginator
         *ngIf="!isAllBooks"
         [length]="total()"
         [pageSize]="pageSize"
         [pageSizeOptions]="[5, 10, 20]"
         (page)="onPageChange($event)">
       </mat-paginator>
       <button mat-raised-button color="primary" routerLink="/books/add" *ngIf="isAuthenticated()">Add Book</button>
        <button mat-raised-button color="primary" (click)="loadAllBooks()">All Books</button>
     `,
     styles: [`
       mat-form-field { width: 100%; margin-bottom: 20px; }
       table { width: 100%; }
       .mat-mdc-row:hover { background-color: #f5f5f5; }
     `]
   })
   export class BookListComponent {
     displayedColumns = ['title', 'author', 'genre', 'rating', 'actions'];
     books = signal<Book[]>([]);
     total = signal<number>(0);
     pageSize = 10;
     currentPage = 0;
     isAllBooks = false;

     constructor(
       private bookService: BookService,
       @Inject(PLATFORM_ID) private platformId: Object
     ) {
       this.loadBooks();
     }

     isAuthenticated = () => {
       if (isPlatformBrowser(this.platformId)) {
         return !!localStorage.getItem('token');
       }
       return false;
     };

     loadBooks(query?: string) {
       this.isAllBooks = false;
       const service = query
         ? this.bookService.searchBooks(query, this.currentPage + 1, this.pageSize)
         : this.bookService.getBooks(this.currentPage + 1, this.pageSize);
       service.subscribe({
         next: (res) => {
           this.books.set(res.books);
           this.total.set(res.total);
         },
         error: (err) => console.error('Error loading books:', err)
       });
     }

     loadAllBooks() {
       this.isAllBooks = true;
       this.bookService.getAllBooks().subscribe({
         next: (books) => {
           this.books.set(books);
           this.total.set(books.length);
         },
         error: (err) => console.error('Error loading all books:', err)
       });
     }

     search(event: Event) {
       const query = (event.target as HTMLInputElement).value;
       this.currentPage = 0;
       this.loadBooks(query);
     }

     onPageChange(event: PageEvent) {
       this.currentPage = event.pageIndex;
       this.pageSize = event.pageSize;
       this.loadBooks();
     }
   }