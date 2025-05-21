import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//import { MatOption } from '@angular/material/select';
import { Router } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
   // MatOption,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
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
    console.log('BookFormComponent constructed');
  }

    genre: string[] = ['Romance', 'Fantasy', 'Science Fiction', 'Paranormal', 'Mystery', 'Horror', 'Thriller/Suspense', 'Action Adventure', 'Historical Fiction','Contemporary Fiction'];
  ngOnInit(): void {
    console.log('BookFormComponent ngOnInit');
    console.log('Initial form state:', this.bookForm.value, 'Valid:', this.bookForm.valid);
  }
    getControl(name: string): FormControl {
    return this.bookForm.get(name) as FormControl;
  }

  onSubmit() {
    console.log('onSubmit triggered', this.bookForm.value);
    console.log('Form valid:', this.bookForm.valid);
    console.log('Form errors:', this.bookForm.errors);
    console.log('Form controls:', {
      title: this.bookForm.get('title')?.errors,
      author: this.bookForm.get('author')?.errors
    });
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;
      const book: Omit<Book, 'id' | 'averageRating' | 'categoryId'> = {
        title: formValue.title!,
        author: formValue.author!,
        genre: formValue.genre || undefined,
        description: formValue.description || undefined
      };
      console.log('Submitting book:', book);
      this.bookService.addBook(book).subscribe({
        next: (response) => {
          console.log('Book added successfully:', response);
          this.navigateToBooks();
        },
        error: (err) => {
          console.error('Error adding book:', err);
          alert('Failed to add book: ' + (err.message || 'Unknown error'));
        }
      });
    } else {
      console.warn('Form invalid, cannot submit');
      alert('Please fill all required fields (Title, Author).');
    }
  }

  navigateToBooks() {
    this.router.navigate(['/books']);
  }
}