using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models.Dto;

namespace Services.Contract
{
    public interface IUserService
    {
        Task<(bool IsSuccess, string? ErrorMessage)> Register(RegisterDto dto);
        
        
    }
}
