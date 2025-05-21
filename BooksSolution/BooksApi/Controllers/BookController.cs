    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using Data;
using Data.Dto;
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

        [HttpGet("category  ")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBooksByCategory([FromQuery] int categoryId)
        {
            var books = await bookService.GetBooksByCategory(categoryId);
            return Ok(books);
        }
        //[HttpGet]
        //[AllowAnonymous]
        //public async Task<IActionResult> GetBooks()
        //{
        //    var result = await bookService.GetBooks();
        //    return Ok(result);
        //}

        [HttpGet("search/{query}")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchBook(String query)
        {
            var books = await bookService.SearchBooks(query);
            if (books != null)
            {
                return Ok(books);
            }
            else
            {
                return NotFound();
            }
        }
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBook(int id)
        {
            var book = await bookService.GetBookById(id);
            return Ok(book);
        }

      
            [HttpPost]
            public async Task<IActionResult> Create([FromBody] CreateBookDto dto)
            {

                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                var email = jwtToken.Claims.FirstOrDefault(c =>
                      c.Type == ClaimTypes.Email || c.Type == JwtRegisteredClaimNames.Email || c.Type == "email")?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized("Email claim not found in token");
                }
                Console.WriteLine($"Extracted email: '{email}'");
                var users = _userManager.Users.ToList();
                foreach (var u in users)
                {
                    Console.WriteLine($"DB Email: '{u.Email}'");
                }
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return Unauthorized("User not found");
                }
                var userId = jwtToken.Claims.FirstOrDefault(c =>
                             c.Type == ClaimTypes.NameIdentifier || c.Type == "nameid")?.Value;
                var book = await bookService.AddBook(dto, userId);
                return CreatedAtAction(nameof(GetAllBooks), new { id = book.Id }, book);
            }

    
            [HttpPut("{id}")]
            public async Task<IActionResult> Update(int id, [FromBody] CreateBookDto dto)
            {
                var updatedBook = await bookService.Update(id, dto);
                return updatedBook != null ? Ok(updatedBook) : NotFound();
            }

        [HttpGet("paged")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPaginatedBooks([FromQuery] PaginationDto paginationDto)
        {
            var paginatedBooks = await bookService.GetPaginatedBooks(paginationDto);
            return Ok(paginatedBooks);
        }

        [HttpDelete("{id}")]
            public async Task<IActionResult> Delete(int id)
            {
                var result = await bookService.Delete(id);
                return result ? Ok() : NotFound();
            }


         }
    }