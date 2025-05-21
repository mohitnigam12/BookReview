import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookDetailsComponent } from './book-details.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { ReviewService } from '../../../services/review.service';
import { of, throwError, Observable } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Book } from '../../../models/book.model';
import { Review } from '../../../models/review.model';

describe('BookDetailsComponent', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    bookServiceSpy = jasmine.createSpyObj('BookService', ['getBook']);
    reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['getReviewsByBookId']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        BookDetailsComponent,
        HttpClientModule,
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        RouterLink
      ],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display book details when book is loaded', () => {
    const mockBook: Book = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Fiction',
      description: 'A test book description',
      averageRating: 4.5
    };
    bookServiceSpy.getBook.and.returnValue(of(mockBook));
    reviewServiceSpy.getReviewsByBookId.and.returnValue(of([]));
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('mat-card-title')).nativeElement;
    const authorElement = fixture.debugElement.query(By.css('mat-card-subtitle')).nativeElement;
    expect(titleElement.textContent).toContain('Test Book');
    expect(authorElement.textContent).toContain('Test Author');
    expect(component.book()?.title).toBe('Test Book');
  });

  it('should display reviews when available', () => {
    const mockBook: Book = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Fiction',
      description: 'A test book description',
      averageRating: 4.5
    };
    const mockReviews: Review[] = [
      {
        
        rating: 4,
        comment: 'Great book!',
        username: 'TestUser',
        createdAt: new Date().toISOString()
      }
    ];
    bookServiceSpy.getBook.and.returnValue(of(mockBook));
    reviewServiceSpy.getReviewsByBookId.and.returnValue(of(mockReviews));
    fixture.detectChanges();

    const reviewElements = fixture.debugElement.queryAll(By.css('.review-card'));
    expect(reviewElements.length).toBe(1);
    const ratingElement = fixture.debugElement.query(By.css('.review-card p')).nativeElement;
    expect(ratingElement.textContent).toContain('Rating: 4/5');
    expect(component.reviews().length).toBe(1);
  });

  it('should show no reviews message when reviews are empty', () => {
    const mockBook: Book = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Fiction',
      description: 'A test book description',
      averageRating: 4.5
    };
    bookServiceSpy.getBook.and.returnValue(of(mockBook));
    reviewServiceSpy.getReviewsByBookId.and.returnValue(of([]));
    fixture.detectChanges();

    const noReviewsElement = fixture.debugElement.query(By.css('.no-reviews')).nativeElement;
    expect(noReviewsElement.textContent).toContain('No reviews yet');
  });

  it('should show error message for invalid book ID', () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        snapshot: { paramMap: { get: () => 'invalid' } }
      }
    });
    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error-container p')).nativeElement;
    expect(errorElement.textContent).toContain('Error: Invalid book ID or book not found');
    expect(component.error()).toBeTrue();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/books']);
  });

  it('should show error message when book fetch fails', () => {
    bookServiceSpy.getBook.and.returnValue(throwError(() => new Error('Not found')));
    reviewServiceSpy.getReviewsByBookId.and.returnValue(of([]));
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error-container p')).nativeElement;
    expect(errorElement.textContent).toContain('Error: Invalid book ID or book not found');
    expect(component.error()).toBeTrue();
  });

  it('should show loading state before data is loaded', () => {
    bookServiceSpy.getBook.and.returnValue(new Observable());
    reviewServiceSpy.getReviewsByBookId.and.returnValue(new Observable());
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('.loading')).nativeElement;
    expect(loadingElement.textContent).toContain('Loading...');
  });
});