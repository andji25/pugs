using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.DTOs;
using TripService.Models;

namespace TripService.Services
{
    public class ChecklistService
    {
        private readonly AppDbContext _context;

        public ChecklistService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ChecklistItemResponseDto>> GetChecklistByTrip(int tripId)
        {
            return await _context.ChecklistItems
                .Where(c => c.TripId == tripId)
                .Select(c => new ChecklistItemResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    IsCompleted = c.IsCompleted,
                    TripId = c.TripId
                })
                .ToListAsync();
        }

        public async Task<ChecklistItemResponseDto> CreateChecklistItem(CreateChecklistItemDto dto)
        {
            var item = new ChecklistItem
            {
                Name = dto.Name,
                TripId = dto.TripId
            };

            _context.ChecklistItems.Add(item);
            await _context.SaveChangesAsync();

            return new ChecklistItemResponseDto
            {
                Id = item.Id,
                Name = item.Name,
                IsCompleted = item.IsCompleted,
                TripId = item.TripId
            };
        }

        public async Task<ChecklistItemResponseDto> ToggleChecklistItem(int id)
        {
            var item = await _context.ChecklistItems.FindAsync(id);

            if (item == null)
                throw new Exception("Checklist item not found");

            item.IsCompleted = !item.IsCompleted;
            await _context.SaveChangesAsync();

            return new ChecklistItemResponseDto
            {
                Id = item.Id,
                Name = item.Name,
                IsCompleted = item.IsCompleted,
                TripId = item.TripId
            };
        }

        public async Task DeleteChecklistItem(int id)
        {
            var item = await _context.ChecklistItems.FindAsync(id);

            if (item == null)
                throw new Exception("Checklist item not found");

            _context.ChecklistItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}
