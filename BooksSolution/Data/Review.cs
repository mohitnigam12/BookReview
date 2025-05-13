using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data
{
    public class Review
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = null!;
        public User User { get; set; } = null!;

        [Required]
        public int BookId { get; set; }
        public Books Book { get; set; } = null!;

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
