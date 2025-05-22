export interface Review {
  id: number;
  userId : string;
  bookId : number;
  rating: number;
  comment?: string;
  username: string;
  createdAt: string; 
}