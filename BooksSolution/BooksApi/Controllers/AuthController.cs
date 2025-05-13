using Microsoft.AspNetCore.Mvc;
using Models.Dto;
using Services.Concrete;
using Services.Contract;

namespace BooksApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;

        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var token = await authService.Login(dto);
            if (token == null)
                return Unauthorized(new { message = "Invalid credentials." });

            //HttpContext.Session.SetString("AuthToken", token);

            return Ok(new { token });
        }

    }
}
