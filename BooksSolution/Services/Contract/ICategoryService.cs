using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data;

namespace Services.Contract
{
    public interface ICategoryService
    {
        Task<List<Category>> GetCategories();
    }
}
