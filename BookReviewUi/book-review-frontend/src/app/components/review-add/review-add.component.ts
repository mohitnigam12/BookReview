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
    CommonModule
  ],
  template: `
    <h2>Add Review</h2>
    <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <mat-label>Rating</mat-label>
        <mat-select formControlName="rating" required>
          <mat-option *ngFor="let rating of [1, 2, 3, 4, 5]" [value]="rating">{{ rating }}</mat-option>
        </mat-select>
        <mat-error *ngIf="reviewForm.get('rating')?.hasError('required')">Rating is required</mat-error>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Comment</mat-label>
        <textarea matInput formControlName="comment" required></textarea>
        <mat-error *ngIf="reviewForm.get('comment')?.hasError('required')">Comment is required</mat-error>
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit" [disabled]="reviewForm.invalid">Submit Review</button>
    </form>
  `,
  styles: [`
    form { display: flex; flex-direction: column; gap: 16px; max-width: 400px; margin: 0 auto; }
    h2 { text-align: center; }
    mat-error { color: red; font-size: 12px; }
  `]
})
export class ReviewAddComponent implements OnInit {
  reviewForm: FormGroup;
  bookId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.bookId = idParam ? +idParam : null;
    if (!this.bookId || isNaN(this.bookId)) {
      console.error('Invalid book ID:', idParam);
      this.router.navigate(['/books']);
    }
  }

  onSubmit() {
    if (this.reviewForm.valid && this.bookId) {
      const review = {
        rating: +this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment
      };
      this.reviewService.addReview(this.bookId, review).subscribe({
        next: (response) => {
          console.log('Review added successfully:', response);
          this.router.navigate(['/books', this.bookId]);
        },
        error: (err) => {
          console.error('Error adding review:', err);
          alert('You Have Already Added a Review for this Book');
        }
      });
    }
  }
}