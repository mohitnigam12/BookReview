export interface Review {
  id: number;
  userId : string;
  rating: number;
  comment?: string;
  username: string;
  createdAt: string; // Matches backend's DateTime
}