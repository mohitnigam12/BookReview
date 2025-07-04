﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace Data.Repository.Contract
{
    public interface IBookRepository
    {
        Task AddBook(Books book);
        Task<List<Books>> GetAllBooks();

        Task<List<Books>> GetBooksByUserId(string userId);
        Task<Books?> GetById(int id);

        Task UpdateBook(Books book);
        Task DeleteBook(Books book);
        Task<List<Books>> SearchBooks(string query);
        Task<Books?> GetBookById(int id);

        public Task<(List<Books>, int)> GetPaginatedBooks(int pageNumber, int pageSize);
    }
}
