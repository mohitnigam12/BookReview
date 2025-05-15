import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <mat-label>Title</mat-label>
        <input matInput formControlName="title">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Author</mat-label>
        <input matInput formControlName="author">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Genre</mat-label>
        <input matInput formControlName="genre">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description"></textarea>
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit" [disabled]="bookForm.invalid">Add Book</button>
    </form>
  `
})
export class BookFormComponent {
  bookForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: [''],
      description: ['']
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const book: Omit<Book, 'id' | 'averageRating'> = {
        title: this.bookForm.value.title!,
        author: this.bookForm.value.author!,
        genre: this.bookForm.value.genre || undefined,
        description: this.bookForm.value.description || undefined
      };
      this.bookService.addBook(book).subscribe({
        next: () => this.router.navigate(['/books']),
        error: () => alert('Failed to add book')
      });
    }
  }
}