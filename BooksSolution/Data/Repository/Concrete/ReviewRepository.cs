﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Repository.Contract;
using Microsoft.EntityFrameworkCore;

namespace Data.Repository.Concrete
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly TestDbContext context;

        public ReviewRepository(TestDbContext context)
        {
            this.context = context;
        }

        public async Task AddReview(Review review)
        {
            context.Reviews.Add(review);
            await context.SaveChangesAsync();
        }

        public async Task<Review> GetReviewById(int reviewId)
        {
            return await context.Reviews.FindAsync(reviewId);
        }

        public async Task UpdateReview(Review review)
        {
            context.Entry(review).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task DeleteReview(Review review)
        {
            context.Reviews.Remove(review);
            await context.SaveChangesAsync();
        }

        public async Task<double> GetAverageRatingForBook(int bookId)
        {
            var rating = await context.Reviews
                                .Where(r => r.BookId == bookId)
                                .AverageAsync(r => (double?)r.Rating) ?? 0.0;
            return rating;
        }

        public async Task<List<Review>> GetReviewsByUserId(string userId)
        {
            return await context.Reviews
                .Where(r => r.UserId == userId)
                .Include(r => r.Book) // Include book details
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Review>> GetReviewsForBook(int bookId)
        {
            var reviews = await context.Reviews
                .Where(r => r.BookId == bookId)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return reviews;
        }

        public async
            Task<bool> HasUserReviewed(string userId, int bookId)
        {
            return await context.Reviews.AnyAsync(r => r.UserId == userId && r.BookId == bookId);
        }
    }
}
