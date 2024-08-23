using api.Data;

namespace api.DTO
{
    public class ViewArticleDto
    {
        public UserDto User { get; set; }
        public Article Article { get; set; }
    }
}
