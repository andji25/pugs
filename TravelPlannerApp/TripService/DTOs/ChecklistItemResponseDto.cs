namespace TripService.DTOs
{
    public class ChecklistItemResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsCompleted { get; set; } = false;
        public int TripId { get; set; }
    }
}
