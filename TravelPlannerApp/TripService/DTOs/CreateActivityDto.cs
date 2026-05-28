using TripService.Enums;

namespace TripService.DTOs
{
    public class CreateActivityDto
    {
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public decimal EstimatedCost { get; set; }
        public ActivityStatus Status { get; set; } = ActivityStatus.Planned;
        public int TripId { get; set; }
    }
}
