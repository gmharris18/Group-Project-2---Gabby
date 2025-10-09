namespace MinigamesAPI.DTOs
{
    public class LoginRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty; // "student" or "teacher"
    }
}

