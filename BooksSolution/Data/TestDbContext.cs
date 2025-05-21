using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using Data;
using Data.Configurations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class TestDbContext : IdentityDbContext<User>
    {
        public TestDbContext(DbContextOptions<TestDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder); 

            modelBuilder.ApplyConfiguration(new BookConfiguration());
            modelBuilder.ApplyConfiguration(new ReviewConfiguration());
            modelBuilder.Entity<Category>().HasData(
            new Category { CategoryId = 1, CategoryName = "Fiction" },
            new Category { CategoryId = 2, CategoryName = "Science" },
            new Category { CategoryId = 3, CategoryName = "Biography" });


        }
         

public DbSet<User> Users { get; set; }
        public DbSet<Books> Books { get; set; }
        public DbSet<Review> Reviews { get; set; }

        public DbSet<Category> Categories { get; set; }
    }
}
