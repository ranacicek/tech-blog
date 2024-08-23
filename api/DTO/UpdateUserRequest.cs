namespace api.DTO
{
    public class UpdateUserRequest
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string About { get; set; }

        public string Password { get; set; }
        public string PasswordConfirm { get; set; }
    }
}
