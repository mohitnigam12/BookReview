using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Models.Dto;
using Services.Concrete;
using Services.Contract;

namespace BooksApi.Controllers
{

    [ApiController]
    [Route("api/books/{bookId}/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService reviewService;

        public ReviewController(IReviewService reviewService)
        {
            reviewService = reviewService;
        }

        [HttpGet]
        public async Task<IActionResult> GetReviews(int bookId)
        {
            var reviews = await reviewService.GetReviewsForBook(bookId);
            var avg = await reviewService.GetAverageRating(bookId);
            return Ok(new { averageRating = avg, reviews });
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddReview(int bookId, [FromBody] CreateReviewDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await reviewService.AddReview(bookId, dto, userId);
            return Ok(new { message = "Review added." });
        }
    }
}
