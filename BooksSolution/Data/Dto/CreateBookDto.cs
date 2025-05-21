using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Dto
{
    public class CreateBookDto
    {
        public string Title { get; set; } 
 
        public string Author { get; set; }

        public string Genre { get; set; }

        public string? Description { get; set; }
    }
}
