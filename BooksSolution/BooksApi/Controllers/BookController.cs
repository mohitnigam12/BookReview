using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<User> _userManager;

        public BookController(IBookService bookService, UserManager<User> userManager)
        {
            this.bookService = bookService;
            _userManager = userManager;
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
        //[AllowAnonymous]
        public async Task<IActionResult> Create([FromBody] CreateBookDto dto)
        {
            //var token = HttpContext.Session.GetString("AuthToken");
            //if (string.IsNullOrEmpty(token))
            //    return Unauthorized("Token not found in session");

            //var handler = new JwtSecurityTokenHandler();
            //var jwtToken = handler.ReadJwtToken(token);

            var email = User.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(email))
                return Unauthorized("Email claim not found in token");

            //var user = await _userManager.FindByEmailAsync(email);

            Console.WriteLine($"Extracted email: '{email}'");
            var users = _userManager.Users.ToList();
            foreach (var u in users)
            {
                Console.WriteLine($"DB Email: '{u.Email}'");
            }
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return Unauthorized("User not found");
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return BadRequest("User ID not found in token claims.");
            }

            string userId = userIdClaim;
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