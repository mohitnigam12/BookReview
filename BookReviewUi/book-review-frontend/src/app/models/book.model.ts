// src/app/models/book.model.ts
export interface Book {
  id: number;
  title: string;
  author: string;
  genre?: string;
  description?: string;
  averageRating: number | null;
  // categoryId? : number;
  // categoryName?: string;
}