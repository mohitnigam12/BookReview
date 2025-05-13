using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Repository.Contract;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Data.Repository.Concrete
{
    public class UserRepository : IUserRepository
    {
        private readonly TestDbContext testDbContext;
        private readonly IPasswordHasher<User> passwordHasher;


        public UserRepository(TestDbContext testDbContext, IPasswordHasher<User> passwordHasher)
        {
            this.testDbContext = testDbContext;
            this.passwordHasher = passwordHasher;
        }

        public async Task<bool> CreateUser(User user ,string password)
        {
            user.PasswordHash = passwordHasher.HashPassword(user,password);
            testDbContext.Users.Add(user);

            var res = testDbContext.SaveChanges();

            return res > 0;
        }

        public async Task<bool> ValidateUserPassword(User user , string password)
        {
            var res = passwordHasher.VerifyHashedPassword(user , user.PasswordHash!, password);
            return res == PasswordVerificationResult.Success;
        }

        public async Task<User> GetUserByUsername(string username)
        {
            return await testDbContext.Users.FirstOrDefaultAsync(u => u.UserName == username);
        }

        public async Task<User> GetUserById(string id)
        {
            return await testDbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        
    }
}
