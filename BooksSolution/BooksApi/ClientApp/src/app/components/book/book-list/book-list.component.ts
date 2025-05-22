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
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
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