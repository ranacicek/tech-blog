using System.ComponentModel.DataAnnotations.Schema;

namespace api.Data
{
    [Table("Users")]
    public class User
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string HashedPassword { get; set; }
        public string PasswordSalt { get; set; }
        public string? About { get; set; }
    }
}
