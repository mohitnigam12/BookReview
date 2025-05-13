using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models.Dto;

namespace Services.Contract
{
    public interface IAuthService
    {
        Task<string?> Login(LoginDto dto);
    }
}
