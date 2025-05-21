using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Repository.Contract;
using Microsoft.EntityFrameworkCore;

namespace Data.Repository.Concrete
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly TestDbContext _context;

        public CategoryRepository(TestDbContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }
    }
}
