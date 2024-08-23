using System.ComponentModel.DataAnnotations.Schema;

namespace api.Data
{
    [Table("Articles")]
    public class Article
    {
        public Guid Id { get; set; }
        public Guid AuthorId { get; set; }
        public string Title { get; set; }
        public string ShortDescription { get; set; }
        public string Content { get; set; }
        public bool IsPublished { get; set; }
        public DateTime Created { get; set; }
    }
}
