using System.ComponentModel.DataAnnotations;

namespace api.DTO
{
    public class AddUpdateArticleRequestDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string ShortDescription { get; set; }
        [Required]
        public string Content { get; set; }
        public bool IsPublished { get; set; }
    }
}
