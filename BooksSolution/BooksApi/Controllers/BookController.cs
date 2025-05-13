using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Dto;
using Services.Concrete;
using Services.Contract;

namespace BooksApi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookController : ControllerBase
    {

        private readonly IBookService bookService;

        public BookController(IBookService bookService)
        {
            this.bookService = bookService;
        }

        [HttpGet("get-all")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await bookService.GetAllBooks();
            return Ok(books);
        }


        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBook(int id)
        {
            var result = await bookService.GetBookById(id);
            if (result != null)
                return Ok(result);
            return NotFound();
        }

      
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            Console.WriteLine(userIdClaim);

            if (userIdClaim == null)
            {
                return BadRequest("User ID not found in claims.");
            }

            string userId = userIdClaim.Value;
            var book = await bookService.AddBook(dto, userId);
            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }

    
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateBookDto dto)
        {
            var updatedBook = await bookService.Update(id, dto);
            return updatedBook != null ? Ok(updatedBook) : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await bookService.Delete(id);
            return result ? Ok() : NotFound();
        }


     }
}