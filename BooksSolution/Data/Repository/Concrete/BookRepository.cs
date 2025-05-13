using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Repository.Contract;
using Microsoft.EntityFrameworkCore;

namespace Data.Repository.Concrete
{
    public class BookRepository : IBookRepository
    {
        private readonly TestDbContext context;

        public BookRepository(TestDbContext context)
        {
            this.context = context;
        }

        public async Task AddBook(Books book)
        {
            context.Books.Add(book);
            await context.SaveChangesAsync();
        }

        public async Task DeleteBook(Books book)
        {
           context.Books.Remove(book);
           await context.SaveChangesAsync();
        }

        public async Task<List<Books>> GetAllBooks()
        {
            return await context.Books.ToListAsync();
        }

        public async Task<Books?> GetBookById(int id)
        {
            return await context.Books.FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<Books?> GetById(int id)
        {
            var book = await context.Books.FindAsync(id);
            return book;
        }

        public async Task<List<Books>> SearchBooks(string query)
        {
            return await context.Books
                .Where(b => b.Title.Contains(query) || b.Author.Contains(query))
                .Include(b => b.AddedByUser)
                .ToListAsync(); 
        }

        public async Task UpdateBook(Books book)
        {
            context.Books.Update(book);
            await context.SaveChangesAsync();
        }
    }
    }
