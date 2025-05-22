using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Repository.Contract;
using Microsoft.EntityFrameworkCore;
using static System.Reflection.Metadata.BlobBuilder;

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
            return await context.Books
                .Select(b => new Books
                {
                    Id = b.Id,
                    Title = b.Title,
                    Author = b.Author,
                    Genre = b.Genre,
                    AverageRating = b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : (double?)null
                })
                .ToListAsync();
        }


        public async Task<List<Books>> GetBooksByUserIdAsync(string userId)
        {
            return await context.Books
                .Where(b => b.AddedByUserId == userId)
                .Select(b => new Books
                 {
                     Id = b.Id,
                     Title = b.Title,
                     Author = b.Author,
                     Genre = b.Genre,
                     AverageRating = b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : (double?)null
                 })
                .ToListAsync();
        }

        public async Task<Books?> GetBookById(int id)
        {
            return await context.Books.FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<List<Books>> GetBooksByCategory(int id)
        {
            return await context.Books
            .Where(b => b.CategoryId == id)
            .ToListAsync();
        }

        public async Task<List<Books>> GetBooksByGenre(string genre)
        {
            return await context.Books
                         .Where(g => g.Genre == genre)
                         .ToListAsync();
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

        public async Task<(List<Books>, int)> GetPaginatedBooks(int pageNumber, int pageSize)
        {
            var query = context.Books.Include(b => b.AddedByUser).AsQueryable();

            int totalItems = await query.CountAsync();
            var books = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (books, totalItems);
        }
    }
    }
