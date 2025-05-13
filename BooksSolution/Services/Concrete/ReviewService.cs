using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Data;
using Data.Repository.Contract;
using Models.Dto;
using Services.Contract;

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
    }
}
