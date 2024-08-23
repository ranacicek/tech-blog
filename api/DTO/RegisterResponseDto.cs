namespace api.DTO
{
    public class RegisterResponseDto
    {
        public UserDto User { get; set; }
        public string AuthToken { get; set; }
    }
}
