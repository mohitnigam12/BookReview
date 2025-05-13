using System;
using System.Threading.Tasks;
using Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Models.Dto;
using Services.Contract;

namespace Services.Concrete
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public UserService(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<(bool IsSuccess, string? ErrorMessage)> Register(RegisterDto dto)
        {
            var existingUser = await _userManager.FindByNameAsync(dto.UserName);
            if (existingUser != null)
                return (false, "Username already exists.");

            var user = new User
            {
                UserName = dto.UserName,
                Email = dto.Email,
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (result.Succeeded)
                return (true, null);

            var errorMessages = string.Join("; ", result.Errors.Select(e => e.Description));
            return (false, errorMessages);
        }
    }
}
