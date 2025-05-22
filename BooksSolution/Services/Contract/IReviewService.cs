using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Dto;
using Models.Dto;

namespace Services.Contract
{
    public interface IReviewService
    {
        Task AddReview(int bookId, CreateReviewDto dto, string userId);
        Task UpdateReviewAsync(int reviewId, UpdateReviewDto updateReviewDto, string currentUserId);
        Task DeleteReviewAsync(int reviewId, string currentUserId);
        Task<double> GetAverageRating(int bookId);
        Task<List<ReviewDto>> GetReviewsForBook(int bookId);
        Task<bool> HasUserReviewed(string userId, int bookId); 
    }
}
