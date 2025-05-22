import { Component, signal, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Book } from '../../../models/book.model';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';
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
    MatSelectModule,
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
        <button mat-stroked-button color="accent" (click)="loadMyBooks()" *ngIf="isAuthenticated()">
          <mat-icon>book</mat-icon> My Books
        </button>
      </div>

      <div class="filter-container">
        <mat-form-field appearance="outline" class="genre-filter">
          <mat-label>Filter by Genre</mat-label>
          <mat-select [(ngModel)]="selectedGenre" (ngModelChange)="onGenreChange()">
            <mat-option value="">All Genres</mat-option>
            <mat-option *ngFor="let genre of genres" [value]="genre">{{ genre }}</mat-option>
          </mat-select>
        </mat-form-field>

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
            <th mat-header-cell *matHeaderCellDef>
              ⭐ Avg. Rating
              <mat-icon class="sort-icon" (click)="toggleSortDirection()">
                {{ sortDirection() === 'asc' ? 'arrow_upward' : sortDirection() === 'desc' ? 'arrow_downward' : 'sort' }}
              </mat-icon>
            </th>
            <td mat-cell *matCellDef="let book">
              <ng-container *ngIf="book.averageRating !== undefined && book.averageRating !== null; else noRating">
                <span class="rating">⭐ {{ book.averageRating | number:'1.1-1' }}</span>
              </ng-container>
              <ng-template #noRating>N/A</ng-template>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>⚙️ Actions</th>
            <td mat-cell *matCellDef="let book" class="ho">
              <button mat-icon-button color="primary" [routerLink]="['/books', book.id]" matTooltip="View Details">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="accent" *ngIf="isAuthenticated()" (click)="navigateToAddReview(book.id)" matTooltip="Add Review">
                <mat-icon>rate_review</mat-icon>
              </button>
              <button mat-icon-button color="warn" *ngIf="isAuthenticated() && (isMyBooks || isUserBook(book))" (click)="navigateToUpdate(book.id)" matTooltip="Edit Book">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" *ngIf="isAuthenticated() && (isMyBooks || isUserBook(book))" (click)="deleteBook(book.id)" matTooltip="Delete Book">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>

      <mat-paginator
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

    .filter-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 25px;
      align-items: flex-start;
    }

    .genre-filter {
      width: 200px;
    }

    .search-container {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      flex: 1;
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

    .ho:hover{
        background-color:hsla(0, 27.30%, 93.50%, 0.89);
        transform: scale(1.05);
    //     transition: background 0.3s ease, transform 0.2s ease;
 
    //   &:hover {
    //     background: rgba(233, 223, 223, 0.89); /* Use a light version of hover-color */
    //     transform: translateY(-2px);
    //     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);}
    }

    .mat-header-cell {
      background-color: #f0f0f0;
      font-weight: bold;
      color: #333;
      padding: 12px 16px;
      vertical-align: middle;
      line-height: 1.5;
      display: flex;
      align-items: center;
      height: 48px;
      box-sizing: border-box;
    }

    .sort-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
      line-height: 18px;
      color: #666;
      transition: color 0.3s ease;
      margin: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .sort-icon:hover {
      color: #3f51b5;
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
  isMyBooks = false;
  searchQuery = '';
  selectedGenre = '';
  genres: string[] = ['Romance', 'Fantasy', 'Science Fiction', 'Paranormal', 'Mystery', 'Horror', 'Thriller/Suspense', 'Action Adventure', 'Historical Fiction', 'Contemporary Fiction'];
  sortDirection = signal<'' | 'asc' | 'desc'>('');

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllBooks();
  }

  isAuthenticated = () => {
    return this.authService.isAuthenticated();
  };

  isUserBook(book: Book): boolean {
    const decodedToken = this.authService.getDecodedToken();
    const userId = decodedToken?.nameid;
    console.log('isUserBook - book:', book);
    console.log('isUserBook - book.addedByUserId:', book.addedByUserId);
    console.log('isUserBook - userId from token:', userId);
    console.log('isUserBook - result:', book.addedByUserId === userId);
    return book.addedByUserId === userId;
  }

  navigateToAddReview(bookId: number) {
    this.router.navigate(['/books', bookId, 'reviews', 'add']).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  editBook(bookId: number) {
    this.router.navigate(['/books', bookId, 'edit']).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  deleteBook(bookId: number) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.books.update(books => books.filter(b => b.id !== bookId));
          this.allBooks.update(books => books.filter(b => b.id !== bookId));
          this.total.update(total => total - 1);
        },
        error: (err) => console.error('Error deleting book:', err)
      });
    }
  }

  toggleSortDirection() {
    const currentDirection = this.sortDirection();
    if (currentDirection === '') {
      this.sortDirection.set('desc');
    } else if (currentDirection === 'desc') {
      this.sortDirection.set('asc');
    } else {
      this.sortDirection.set('');
    }
    this.applySort();
  }

  applySort() {
    const direction = this.sortDirection();
    let sortedBooks = [...this.books()];
    
    if (direction) {
      sortedBooks.sort((a, b) => {
        const ratingA = a.averageRating ?? -1;
        const ratingB = b.averageRating ?? -1;
        return direction === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      });
    }
    this.books.set(sortedBooks);
  }

  loadBooks() {
    this.isAllBooks = false;
    this.isSearch = false;
    this.isMyBooks = false;
    this.searchQuery = '';
    this.selectedGenre = '';
    this.sortDirection.set('');
    this.bookService.getBooks(this.currentPage + 1, this.pageSize).subscribe({
      next: (res) => {
        this.books.set(res.books);
        this.total.set(res.total);
        this.allBooks.set(res.books);
        this.applySort();
      },
      error: (err) => console.error('Error loading books:', err)
    });
  }

  loadAllBooks() {
    this.isAllBooks = true;
    this.isSearch = false;
    this.isMyBooks = false;
    this.searchQuery = '';
    this.selectedGenre = '';
    this.sortDirection.set('');
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

  loadMyBooks() {
    if (!this.isAuthenticated()) {
      console.error('User not authenticated');
      return;
    }

    const decodedToken = this.authService.getDecodedToken();
    const userId = decodedToken?.nameid;
    if (!userId) {
      console.error('User ID not found in token');
      return;
    }

    this.isMyBooks = true;
    this.isAllBooks = false;
    this.isSearch = false;
    this.searchQuery = '';
    this.selectedGenre = '';
    this.sortDirection.set('');
    this.currentPage = 0;

    this.bookService.getBooksByUserId(userId).subscribe({
      next: (res) => {
        this.allBooks.set(res.books);
        this.total.set(res.total);
        this.updateBooksForPage();
      },
      error: (err) => console.error('Error loading user books:', err)
    });
  }

  updateBooksForPage() {
    let filteredBooks = [...this.allBooks()];
    if (this.selectedGenre) {
      filteredBooks = filteredBooks.filter(book => book.genre === this.selectedGenre);
    }
    this.total.set(filteredBooks.length);
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const sliced = filteredBooks.slice(start, end);
    this.books.set(sliced);
    this.applySort();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.isAllBooks || this.isMyBooks || this.isSearch) {
      this.updateBooksForPage();
    } else {
      this.loadBooks();
    }
  }

  search() {
    if (!this.searchQuery.trim()) {
      this.loadAllBooks();
      return;
    }
    this.currentPage = 0;
    this.isSearch = true;
    this.isMyBooks = false;
    this.isAllBooks = false;
    this.bookService.searchBooks(this.searchQuery).subscribe({
      next: (res) => {
        this.allBooks.set(res.books);
        this.updateBooksForPage();
      },
      error: (err) => console.error('Error searching books:', err)
    });
  }

  navigateToUpdate(bookId: number) {
    console.log('BookListComponent: Navigating to update for book ID:', bookId);
    this.router.navigate(['/books', bookId, 'updateBook']).catch(err => {
      console.error('BookListComponent: Navigation error:', err);
    });
  }

  onQueryChange() {
    if (!this.searchQuery.trim() && this.isSearch) {
      this.isSearch = false;
      this.loadBooks();
    }
  }

  onGenreChange() {
    this.currentPage = 0;
    if (this.isAllBooks || this.isMyBooks || this.isSearch) {
      this.updateBooksForPage();
    } else {
      this.loadBooks();
    }
  }
}