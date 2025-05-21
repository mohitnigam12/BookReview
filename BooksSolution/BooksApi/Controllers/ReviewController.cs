using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Dto;
using Services.Contract;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BooksApi.Controllers
{
    [ApiController]
    [Route("api/books/{bookId}/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService reviewService;

        public ReviewController(IReviewService reviewService)
        {
            this.reviewService = reviewService;
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
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { message = "User not authenticated" });

                await reviewService.AddReview(bookId, dto, userId);
                return Ok(new { message = "Review added." });
            }
            catch (Exception ex) when (ex.Message == "You already reviewed this book.")
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the error (assuming a logger is injected or available)
                return StatusCode(500, new { message = "An error occurred while adding the review", error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("user")]
        public async Task<IActionResult> HasUserReviewed(int bookId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User not authenticated" });

            var hasReviewed = await reviewService.HasUserReviewed(userId, bookId);
            return Ok(new { hasReviewed });
        }
    }
}
