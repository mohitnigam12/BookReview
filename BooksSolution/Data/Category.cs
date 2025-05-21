using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }

        // Navigation property
        public ICollection<Books> Books { get; set; }
    }

}
