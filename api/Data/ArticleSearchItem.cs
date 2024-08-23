namespace api.Data
{
    public class ArticleSearchItem
    {
        public Guid Id { get; set; }
        public Guid AuthorId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Title { get; set; }
        public string ShortDescription { get; set; }            
        public DateTime Created { get; set; }
    }
}
