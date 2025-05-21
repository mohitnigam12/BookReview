using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repository.Contract
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetCategories();
    }
}
