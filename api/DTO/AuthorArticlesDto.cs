namespace api.DTO
{
    public class AuthorArticlesDto
    {
        public UserDto User { get; set; }
        public PagedArticleList Articles { get; set; }
    }
}
