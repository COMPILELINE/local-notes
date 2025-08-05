using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace local_notes.Models
{
    public class Note
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        
        // This is a list of note titles for bi-directional links
        [JsonIgnore]
        public string[]? Backlinks { get; set; }
    }
}
