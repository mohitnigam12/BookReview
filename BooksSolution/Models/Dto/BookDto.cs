using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Dto
{
    public class BookDto
    {
        public int Id { get; set; }
        public string Title { get; set; } 
        public string Author { get; set; } 
        public string? Description { get; set; }
        public string AddedBy { get; set; }
    }
}
