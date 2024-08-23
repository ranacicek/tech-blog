namespace api.DTO
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string? About { get; set; }
    }
}
