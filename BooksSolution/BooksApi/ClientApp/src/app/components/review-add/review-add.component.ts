import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { Review } from '../../models/review.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-review-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    HttpClientModule,
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: `./review-add.component.html`,
  styleUrls: [`./review-add.component.scss`]
})
export class ReviewAddComponent implements OnInit {
  reviewForm: FormGroup;
  bookId!: number; // Changed to non-nullable after validation in ngOnInit
  isEditing: boolean = false;
  currentReview: Review | null = null;
  currentUserId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Get book ID from route
    const idParam = this.route.snapshot.paramMap.get('id');
    const bookId = idParam ? +idParam : null;
    if (!bookId || isNaN(bookId)) {
      console.error('Invalid book ID:', idParam);
      this.router.navigate(['/books']);
      return;
    }
    this.bookId = bookId; // Assign to bookId after validation, ensuring it's a number

    // Get current user ID
    if (this.authService.isAuthenticated()) {
      const decodedToken = this.authService.getDecodedToken();
      this.currentUserId = decodedToken?.nameid || null;
    }

    // Check if user has already reviewed this book
    this.reviewService.hasUserReviewed(this.bookId).subscribe({
      next: (response) => {
        if (response.hasReviewed) {
          // Fetch all reviews to find the user's review
          this.reviewService.getReviewsByBookId(this.bookId).subscribe({
            next: (reviews) => {
              this.currentReview = reviews.find(review => review.userId === this.currentUserId) || null;
              if (this.currentReview) {
                this.isEditing = true;
                this.reviewForm.patchValue({
                  rating: this.currentReview.rating,
                  comment: this.currentReview.comment
                });
              }
            },
            error: (err) => {
              console.error('Error fetching reviews:', err);
              this.snackBar.open('Failed to load existing review', 'Close', { duration: 3000 });
            }
          });
        }
      },
      error: (err) => {
        console.error('Error checking if user has reviewed:', err);
        this.snackBar.open('Error checking review status', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      const review = {
        rating: +this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment
      };

      if (this.isEditing && this.currentReview) {
        // Update existing review
        this.reviewService.updateReview(this.currentReview.id, review).subscribe({
          next: () => {
            this.snackBar.open('Review updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/books', this.bookId]);
          },
          error: (err) => {
            console.error('Error updating review:', err);
            this.snackBar.open(err.message || 'Failed to update review', 'Close', { duration: 3000 });
          }
        });
      } else {
        // Add new review
        this.reviewService.addReview(this.bookId, review).subscribe({
          next: (response) => {
            console.log('Review added successfully:', response);
            this.snackBar.open('Review added successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/books', this.bookId]);
          },
          error: (err) => {
            console.error('Error adding review:', err);
            this.snackBar.open(err.message || 'You have already added a review for this book', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  deleteReview() {
    if (this.currentReview && confirm('Are you sure you want to delete your review?')) {
      this.reviewService.deleteReview(this.bookId, this.currentReview.id).subscribe({
        next: () => {
          this.snackBar.open('Review deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/books', this.bookId]);
        },
        error: (err) => {
          console.error('Error deleting review:', err);
          this.snackBar.open(err.message || 'Failed to delete review', 'Close', { duration: 3000 });
        }
      });
    }
  }
}