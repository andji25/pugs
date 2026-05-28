using UserService.Enums;

namespace UserService.DTOs
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public UserRole Role { get; set; }
        public string Token { get; set; }
    }
}
