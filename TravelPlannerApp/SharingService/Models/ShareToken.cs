using SharingService.Enums;

namespace SharingService.Models
{
    public class ShareToken
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public int TripId { get; set; }
        public ShareAccessType AccessType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
