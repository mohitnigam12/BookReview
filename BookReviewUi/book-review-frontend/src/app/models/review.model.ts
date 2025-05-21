export interface Review {
  rating: number;
  comment?: string;
  username: string;
  createdAt: string; // Matches backend's DateTime
}