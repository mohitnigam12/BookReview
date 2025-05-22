using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Data;
using Data.Dto;
using Data.Repository.Concrete;
using Data.Repository.Contract;
using Models.Dto;
using Services.Contract;
using static System.Reflection.Metadata.BlobBuilder;

namespace Services.Concrete
{
    public class BookService : IBookService
    {
        private readonly IBookRepository bookRepo;
        private readonly IUserRepository userRepo;
        private readonly IMapper mapper;

        public BookService(IBookRepository bookRepo, IUserRepository userRepo, IMapper mapper)
        {
            this.bookRepo = bookRepo;
            this.userRepo = userRepo;
            this.mapper = mapper;
        }

        public async Task<BookDto> AddBook(CreateBookDto dto, string userId)
        {
            var user = await userRepo.GetUserById(userId);
            if (user == null) throw new Exception("Invalid user.");

            var book = mapper.Map<Books>(dto);
            book.AddedByUserId = userId;

            await bookRepo.AddBook(book);

            return mapper.Map<BookDto>(book);
        }

        public async Task<List<Books>> GetBooksByUserIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentException("User ID cannot be null or empty.", nameof(userId));
            }
            return await bookRepo.GetBooksByUserIdAsync(userId);
        }

        public async Task<bool> Delete(int id)
        {
            var book = await bookRepo.GetBookById(id);
            if (book == null) return false;
            await bookRepo.DeleteBook(book);
            return true;
        }

        public async Task<List<BookDto>> GetAllBooks()
        {
            var books = await bookRepo.GetAllBooks();
            return mapper.Map<List<BookDto>>(books);
        }

        public async Task<BookDto?> GetBookById(int id)
        {
            var book = await bookRepo.GetBookById(id);
            Console.WriteLine($"Fetched book: {book?.Title}, Id: {book?.Id}");
            if (book == null)
            {
                Console.WriteLine($"Book with ID {id} not found.");
                return null;
            }
            return mapper.Map<BookDto>(book);
        }

        public async Task<List<BookDto>> SearchBooks(string query)
        {
            var book = await bookRepo.SearchBooks(query);
            return mapper.Map<List<BookDto>>(book);
        }

        public async Task<bool> Update(int id, CreateBookDto dto)
        {
            var book = await bookRepo.GetById(id);
            if (book == null) return false;

            mapper.Map(dto, book);
            await bookRepo.UpdateBook(book);
            return true;
        }

        public async Task<PagedResponse<BookDto>> GetPaginatedBooks(PaginationDto paginationDto)
        {
            var (books, totalItems) = await bookRepo.GetPaginatedBooks(paginationDto.PageNumber, paginationDto.PageSize);
            var bookDtos = mapper.Map<List<BookDto>>(books);

            return new PagedResponse<BookDto>(bookDtos, totalItems, paginationDto.PageNumber, paginationDto.PageSize);
        }

        public async Task<List<Books>> GetBooksByCategory(int categoryId)
        {
            return await bookRepo.GetBooksByCategory(categoryId);
        }
    }
}
