import { Component, signal, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Book } from '../../../models/book.model';
import { BookService } from '../../../services/book.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="book-list-container">
      <h2>📚 Our Book Library</h2>

      <div class="action-buttons">
        <button mat-raised-button color="primary" routerLink="/books/add" *ngIf="isAuthenticated()">
          <mat-icon>add</mat-icon> Add Book
        </button>
        <button mat-stroked-button color="accent" (click)="loadAllBooks()">
          <mat-icon>list</mat-icon> Show All Books
        </button>
      </div>

      <div class="search-container">
        <mat-form-field appearance="outline" class="search-bar">
          <mat-label>Search Books</mat-label>
          <input matInput [(ngModel)]="searchQuery" placeholder="By title, author, or genre" (ngModelChange)="onQueryChange()">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="search()" [disabled]="!searchQuery.trim()">
          <mat-icon>search</mat-icon> Search
        </button>
      </div>

      <div class="table-wrapper mat-elevation-z8">
        <table mat-table [dataSource]="books()" class="styled-table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>📖 Title</th>
            <td mat-cell *matCellDef="let book">{{ book.title }}</td>
          </ng-container>

          <ng-container matColumnDef="author">
            <th mat-header-cell *matHeaderCellDef>✍️ Author</th>
            <td mat-cell *matCellDef="let book">{{ book.author }}</td>
          </ng-container>

          <ng-container matColumnDef="genre">
            <th mat-header-cell *matHeaderCellDef>🏷️ Genre</th>
            <td mat-cell *matCellDef="let book">{{ book.genre || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="rating">
            <th mat-header-cell *matHeaderCellDef>⭐ Avg. Rating</th>
            <td mat-cell *matCellDef="let book">
              <ng-container *ngIf="book.averageRating !== undefined && book.averageRating !== null; else noRating">
                <span class="rating">⭐ {{ book.averageRating | number:'1.1-1' }}</span>
              </ng-container>
              <ng-template #noRating>N/A</ng-template>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>⚙️ Actions</th>
            <td mat-cell *matCellDef="let book">
              <button mat-icon-button color="primary" [routerLink]="['/books', book.id]" matTooltip="View Details">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="accent" *ngIf="isAuthenticated()" (click)="navigateToAddReview(book.id)" matTooltip="Add Review">
                <mat-icon>rate_review</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>

      <mat-paginator
        *ngIf="!isSearch && !isAllBooks"
        [length]="total()"
        [pageSize]="pageSize"
        [pageIndex]="currentPage"
        [pageSizeOptions]="[5, 10, 20]"
        (page)="onPageChange($event)">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .book-list-container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 20px;
    }

    h2 {
      text-align: center;
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 30px;
      color: #3f51b5;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 20px;
    }

    .search-container {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 25px;
    }

    .search-bar {
      flex: 1;
    }

    .search-container button {
      height: 56px;
    }

    .table-wrapper {
      border-radius: 12px;
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    .mat-header-cell {
      background-color: #f0f0f0;
      font-weight: bold;
      color: #333;
    }

    .mat-row:hover {
      background-color: #f9f9f9;
    }

    td button {
      margin-right: 8px;
    }

    mat-icon {
      vertical-align: middle;
    }

    .rating {
      color: #fbc02d;
      font-weight: bold;
      font-size: 14px;
    }
  `]
})
export class BookListComponent implements OnInit {
  displayedColumns = ['title', 'author', 'genre', 'rating', 'actions'];
  books = signal<Book[]>([]);
  allBooks = signal<Book[]>([]);
  total = signal<number>(0);
  pageSize = 10;
  currentPage = 0;
  isAllBooks = false;
  isSearch = false;
  searchQuery = '';

  constructor(
    private bookService: BookService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  isAuthenticated = () => {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  };

  navigateToAddReview(bookId: number) {
    this.router.navigate(['/books', bookId, 'reviews', 'add']).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  loadBooks() {
    this.isAllBooks = false;
    this.isSearch = false;
    this.searchQuery = '';
    this.bookService.getBooks(this.currentPage + 1, this.pageSize).subscribe({
      next: (res) => {
        this.books.set(res.books);
        this.total.set(res.total);
      },
      error: (err) => console.error('Error loading books:', err)
    });
  }

  loadAllBooks() {
    this.isAllBooks = true;
    this.isSearch = false;
    this.searchQuery = '';
    this.currentPage = 0;
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.allBooks.set(books);
        this.total.set(books.length);
        this.updateBooksForPage();
      },
      error: (err) => console.error('Error loading all books:', err)
    });
  }

  updateBooksForPage() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const sliced = this.allBooks().slice(start, end);
    this.books.set(sliced);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.isAllBooks) {
      this.updateBooksForPage();
    } else {
      this.loadBooks();
    }
  }

  search() {
    this.currentPage = 0;
    this.isSearch = !!this.searchQuery.trim();
    this.bookService.searchBooks(this.searchQuery).subscribe({
      next: (res) => {
        this.books.set(res.books);
        this.total.set(res.total);
      },
      error: (err) => console.error('Error searching books:', err)
    });
  }

  onQueryChange() {
    if (!this.searchQuery.trim() && this.isSearch) {
      this.isSearch = false;
      this.loadAllBooks();
    }
  }
}
