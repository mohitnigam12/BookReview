using Microsoft.AspNetCore.Mvc;
using Models.Dto;
using Services.Concrete;
using Services.Contract;

namespace BooksApi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;

        public UserController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var (isSuccess, error) = await userService.Register(dto);
            if (!isSuccess)
                return BadRequest(new { message = error });

            return Ok(new { message = "User registered successfully." });
        }
    }
}
