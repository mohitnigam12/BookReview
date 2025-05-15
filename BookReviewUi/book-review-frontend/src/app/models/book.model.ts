export interface Book {
  id: number;
  title: string;
  author: string;
  genre?: string;
  description?: string;
  averageRating?: number;
}