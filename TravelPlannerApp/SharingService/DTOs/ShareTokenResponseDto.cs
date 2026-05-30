using SharingService.Enums;

namespace SharingService.DTOs
{
    public class ShareTokenResponseDto
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public int TripId { get; set; }
        public ShareAccessType AccessType { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsActive { get; set; }
    }
}
