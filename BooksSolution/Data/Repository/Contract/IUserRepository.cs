using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Data.Repository.Contract
{
    public interface IUserRepository
    {
        Task<User> GetUserByUsername(string username);
        Task<bool> ValidateUserPassword(User user, string password);
        Task<bool> CreateUser(User user, string password);

        Task<User> GetUserById(string id);
    }
}
