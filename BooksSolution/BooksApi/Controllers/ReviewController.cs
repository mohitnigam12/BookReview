using Data.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Dto;
using Services.Concrete;
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

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, UpdateReviewDto updateReviewDto)
        {
            try
            {
                await reviewService.UpdateReviewAsync(id, updateReviewDto, GetUserId());
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the review", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            try
            {
                await reviewService.DeleteReviewAsync(id, GetUserId());
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the review", details = ex.Message });
            }
        }
    }
}
