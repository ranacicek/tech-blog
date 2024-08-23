using api.Data;

namespace api.DTO
{
    public class PagedArticleList
    {
        public int PageNo { get; set; }
        public int TotalPages { get; set; }
        public List<ArticleSearchItem> Items { get; set; }

        public PagedArticleList(int pageNo, int totalPages, List<ArticleSearchItem> items)
        {
            this.PageNo = pageNo;
            this.TotalPages = totalPages;
            this.Items = items;
        }
    }
}
