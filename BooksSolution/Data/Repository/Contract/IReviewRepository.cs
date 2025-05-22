using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repository.Contract
{
    public interface IReviewRepository
    {
        Task AddReview(Review review);

        Task<Review> GetReviewById(int reviewId);
        Task UpdateReview(Review review);
        Task DeleteReview(Review review);
        Task<List<Review>> GetReviewsForBook(int bookId);
        Task<double> GetAverageRatingForBook(int bookId);
        Task<bool> HasUserReviewed(string userId, int bookId);

        Task<List<Review>> GetReviewsByUserId(string userId);
    }
}
