using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data;
using Data.Repository.Concrete;
using Data.Repository.Contract;
using Microsoft.Extensions.Configuration;
using Models.Dto;
using Services.Contract;

namespace Services.Concrete
{
    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;
        private readonly IConfiguration configuration;

        public UserService(IUserRepository userRepository, IConfiguration configuration)
        {
            this.userRepository = userRepository;
            this.configuration = configuration;
        }

      

        public async Task<(bool IsSuccess, string? ErrorMessage)> Register(RegisterDto dto)
        {
            var existingUser = await userRepository.GetUserByUsername(dto.UserName);
            if (existingUser != null)
                return (false, "Username already exists.");

            var user = new User
            {
                UserName = dto.UserName,
                Email = dto.Email
            };

            var success = await userRepository.CreateUser(user, dto.Password);
            return success ? (true, null) : (false, "Registration failed.");
        }
    }
}
