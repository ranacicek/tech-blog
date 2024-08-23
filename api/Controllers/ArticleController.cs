using api.Data;
using api.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace api.Controllers
{
    [Route("api/article")]
    public class ArticleController : ControllerBase
    {
        const int ArticlePageSize = 5;

        private readonly DataContext _dataContext;

        public ArticleController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> AddArticle([FromBody] AddUpdateArticleRequestDto addArticleDto)
        {
            var userId = this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier).Value;

            var article = new Article()
            {
                Id=Guid.NewGuid(),
                AuthorId = Guid.Parse(userId),
                Title=addArticleDto.Title,
                ShortDescription=addArticleDto.ShortDescription,
                Content = addArticleDto.Content,
                IsPublished=addArticleDto.IsPublished,
                Created = DateTime.Now
            };

            _dataContext.Articles.Add(article);
            await _dataContext.SaveChangesAsync();
            
            return new JsonResult(article);
        }

        [Authorize]
        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult> UpdateArticle(Guid id, [FromBody] AddUpdateArticleRequestDto updateArticleDto)
        {
            var userId = Guid.Parse(this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier).Value);

            var article = await _dataContext.Articles.Where(x => x.Id == id && x.AuthorId == userId).FirstOrDefaultAsync();
            if(article == null)
                return NotFound("Article not found.");

            article.Title = updateArticleDto.Title;
            article.ShortDescription=updateArticleDto.ShortDescription;
            article.Content = updateArticleDto.Content;
            article.IsPublished = updateArticleDto.IsPublished;

            await _dataContext.SaveChangesAsync();

            return Ok("Article updated.");
        }

        [Authorize]
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> DeleteArticle(Guid id)
        {
            var userId = Guid.Parse(this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier).Value);

            var article = await _dataContext.Articles.Where(x => x.Id == id && x.AuthorId == userId).FirstOrDefaultAsync();
            if (article == null)
                return NotFound("Article not found.");

            _dataContext.Articles.Remove(article);

            await _dataContext.SaveChangesAsync();

            return Ok("Article deleted.");
        }      
       

        [Authorize]
        [HttpGet]
        [Route("myarticles")]
        public async Task<ActionResult> MyArticles(int pageNo)
        {
            var userId = this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier).Value.ToUpper();
            var userGuid = Guid.Parse(userId);

            int totalArticles = await _dataContext.Articles.CountAsync(x => x.AuthorId == userGuid);
            int totalPages = totalArticles / ArticlePageSize;
            if ((totalArticles % ArticlePageSize) != 0)
                totalPages++;

            if(pageNo > totalPages)
                pageNo = totalPages;

            if(pageNo < 1)
                pageNo = 1;

            string query = "SELECT ";
            query += " u.FirstName, u.Surname";
            query += ",a.Id, a.AuthorId, a.Title, a.ShortDescription, a.Created";
            query += " FROM Articles a";
            query += " LEFT JOIN Users u ON u.Id=a.AuthorId";
            query += " WHERE AuthorId='" + userId + "'";
            query += " ORDER BY Created DESC LIMIT "+ ArticlePageSize+" OFFSET "+ ((pageNo-1) * ArticlePageSize);

            var articles = await _dataContext
                .ArticleSearchView
                .FromSqlRaw(query)
                .ToListAsync();

            var pagedList = new PagedArticleList(pageNo, totalPages, articles);

            return new JsonResult(pagedList);
        }

        [HttpGet]
        [Route("latest")]
        public async Task<ActionResult> LatestArticles(int pageNo=1)
        {
            try
            {
                int totalArticles = await _dataContext.Articles.CountAsync(x => x.IsPublished == true);
                int totalPages = totalArticles / ArticlePageSize;
                if ((totalArticles % ArticlePageSize) != 0)
                    totalPages++;

                if (pageNo > totalPages)
                    pageNo = totalPages;

                if (pageNo < 1)
                    pageNo = 1;

                string query = "SELECT ";
                query += " u.FirstName, u.Surname";
                query += ",a.Id, a.AuthorId, a.Title, a.ShortDescription, a.Created";
                query += " FROM Articles a";
                query += " LEFT JOIN Users u ON u.Id=a.AuthorId";
                query += " WHERE a.IsPublished=1";
                query += " ORDER BY Created DESC LIMIT " + ArticlePageSize + " OFFSET " + ((pageNo - 1) * ArticlePageSize);

                var articles = await _dataContext
                    .ArticleSearchView
                    .FromSqlRaw(query)
                    .ToListAsync();

                var pagedList = new PagedArticleList(pageNo, totalPages, articles);

                return new JsonResult(pagedList);
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }           
        }
       
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> GetArticle(Guid id)
        {
            var userId = Guid.Parse(this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier).Value);

            var article = await _dataContext.Articles.Where(x => x.Id == id).FirstOrDefaultAsync();
            if (article == null)
                return NotFound("Article not found.");

            var user = await _dataContext.Users.Where(x=> x.Id == userId).FirstOrDefaultAsync();

            var viewDto = new ViewArticleDto()
            {
                User=new UserDto()
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    Surname = user.Surname,
                    Email = user.Email
                },
                Article=article
            };

            return new JsonResult(viewDto);
        }
        
        [HttpGet]
        [Route("authorarticles/{id}")]
        public async Task<ActionResult> AuthorArticles(Guid id, int pageNo)
        {
            var user = await _dataContext.Users.Where(x => x.Id == id).FirstOrDefaultAsync();

            int totalArticles = await _dataContext.Articles.CountAsync(x => x.AuthorId == id && x.IsPublished==true);
            int totalPages = totalArticles / ArticlePageSize;
            if ((totalArticles % ArticlePageSize) != 0)
                totalPages++;

            if (pageNo > totalPages)
                pageNo = totalPages;

            if (pageNo < 1)
                pageNo = 1;

            string query = "SELECT ";
            query += " u.FirstName, u.Surname";
            query += ",a.Id, a.AuthorId, a.Title, a.ShortDescription, a.Created";
            query += " FROM Articles a";
            query += " LEFT JOIN Users u ON u.Id=a.AuthorId";
            query += " WHERE AuthorId='" + id.ToString().ToUpper() + "' AND IsPublished=1";
            query += " ORDER BY Created DESC LIMIT " + ArticlePageSize + " OFFSET " + ((pageNo - 1) * ArticlePageSize);

            var articles = await _dataContext
                .ArticleSearchView
                .FromSqlRaw(query)
                .ToListAsync();

            var pagedList = new PagedArticleList(pageNo, totalPages, articles);

            var authorArticles = new AuthorArticlesDto()
            {
                User = new UserDto()
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    Surname = user.Surname,
                    Email = user.Email
                },
                Articles= pagedList
            };

            return new JsonResult(authorArticles);
        }

        [HttpGet]
        [Route("search")]
        public async Task<ActionResult> SearchArticles(string searchText, int pageNo = 1)
        {
            try
            {
                int totalArticles = await _dataContext.Articles
                    .Where(x => x.IsPublished == true)
                    .Where(x=> x.ShortDescription.Contains(searchText) || x.Content.Contains(searchText))
                    .CountAsync();

                int totalPages = totalArticles / ArticlePageSize;
                if ((totalArticles % ArticlePageSize) != 0)
                    totalPages++;

                if (pageNo > totalPages)
                    pageNo = totalPages;

                if (pageNo < 1)
                    pageNo = 1;

                string query = "SELECT ";
                query += " u.FirstName, u.Surname";
                query += ",a.Id, a.AuthorId, a.Title, a.ShortDescription, a.Created";
                query += " FROM Articles a";
                query += " LEFT JOIN Users u ON u.Id=a.AuthorId";
                query += " WHERE a.IsPublished=1";
                query += $" AND (a.ShortDescription LIKE '%{searchText}%' OR a.Content LIKE '%{searchText}%')";
                query += " ORDER BY Created DESC LIMIT " + ArticlePageSize + " OFFSET " + ((pageNo - 1) * ArticlePageSize);

                var articles = await _dataContext
                    .ArticleSearchView
                    .FromSqlRaw(query)
                    .ToListAsync();

                var pagedList = new PagedArticleList(pageNo, totalPages, articles);

                return new JsonResult(pagedList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
