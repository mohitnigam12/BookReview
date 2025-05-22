using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data;
using Data.Dto;
using Models.Dto;

namespace Services.Contract
{
    public interface IBookService
    {
        Task<BookDto> AddBook(CreateBookDto dto, string userId);

        public Task<PagedResponse<BookDto>> GetPaginatedBooks(PaginationDto paginationDto);
        Task<List<BookDto>> GetAllBooks();

        Task<List<Books>> GetBooksByUserIdAsync(string userId);
        Task<List<BookDto>> SearchBooks(string query);
        Task<BookDto?> GetBookById(int id);

        Task<bool> Update(int id, CreateBookDto dto);
        Task<bool> Delete(int id);

        //Task<List<BookDto>> GetBookByCategory(string category);

        Task<List<Books>> GetBooksByCategory(int categoryId);
    }
}
