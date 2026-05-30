using SharingService.Enums;

namespace SharingService.DTOs
{
    public class CreateShareTokenDto
    {
        public int TripId { get; set; }
        public ShareAccessType AccessType { get; set; }
        public int ExpiresInDays { get; set; } = 7;
    }
}
