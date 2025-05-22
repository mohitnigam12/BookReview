using AutoMapper;
using Data;
using Data.Dto;
using Data.Repository.Concrete;
using Data.Repository.Contract;
using Models.Dto;
using Services.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Services.Concrete
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository reviewRepo;
        private readonly IBookRepository bookRepo;
        private readonly IUserRepository userRepo;
        private readonly IMapper mapper;

        public ReviewService(IReviewRepository reviewRepo, IBookRepository bookRepo, IUserRepository userRepo, IMapper mapper)
        {
            this.reviewRepo = reviewRepo;
            this.bookRepo = bookRepo;
            this.userRepo = userRepo;
            this.mapper = mapper;
        }

        public async Task AddReview(int bookId, CreateReviewDto dto, string userId)
        {
            var book = await bookRepo.GetBookById(bookId);
            if (book == null)
                throw new Exception("Book not found.");

            if (await reviewRepo.HasUserReviewed(userId, bookId))
                throw new Exception("You already reviewed this book.");

            var review = mapper.Map<Review>(dto);
            review.BookId = bookId;
            review.UserId = userId;

            await reviewRepo.AddReview(review);
        }

        public async Task<double> GetAverageRating(int bookId)
        {
            var rating = await reviewRepo.GetAverageRatingForBook(bookId);
            return rating;
        }

        public async Task<List<ReviewDto>> GetReviewsForBook(int bookId)
        {
            var reviews = await reviewRepo.GetReviewsForBook(bookId);
            return mapper.Map<List<ReviewDto>>(reviews);
        }

        public async Task<bool> HasUserReviewed(string userId, int bookId)
        {
            return await reviewRepo.HasUserReviewed(userId, bookId);
        }

        public async Task UpdateReviewAsync(int reviewId, UpdateReviewDto updateReviewDto, string currentUserId)
        {
            var review = await reviewRepo.GetReviewByIdAsync(reviewId);
            if (review == null)
            {
                throw new KeyNotFoundException("Review not found");
            }

            if (review.UserId != currentUserId)
            {
                throw new UnauthorizedAccessException("You are not authorized to update this review");
            }

            review.Rating = updateReviewDto.Rating;
            review.Comment = updateReviewDto.Comment;

            await reviewRepo.UpdateReviewAsync(review);
        }

        public async Task DeleteReviewAsync(int reviewId, string currentUserId)
        {
            var review = await reviewRepo.GetReviewByIdAsync(reviewId);
            if (review == null)
            {
                throw new KeyNotFoundException("Review not found");
            }

            if (review.UserId != currentUserId)
            {
                throw new UnauthorizedAccessException("You are not authorized to delete this review");
            }

            await reviewRepo.DeleteReviewAsync(review);
        }
    }
}