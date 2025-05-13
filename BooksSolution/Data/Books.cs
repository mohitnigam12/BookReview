using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data
{
    public class Books
    {
        public int Id { get; set; }

       
        public string Title { get; set; } 

       
        public string Author { get; set; }

        public string? Description { get; set; }

        public string AddedByUserId { get; set; }

        public User AddedByUser { get; set; }

        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
