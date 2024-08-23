using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<ArticleSearchItem> ArticleSearchView { get; set; }

        public DataContext(DbContextOptions options) : base(options)
        {            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ArticleSearchItem>().HasNoKey();

            base.OnModelCreating(modelBuilder);
        }
    }
}
