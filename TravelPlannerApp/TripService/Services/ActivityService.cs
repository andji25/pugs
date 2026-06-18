using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.DTOs;
using TripService.Models;
using TripService.Enums;

namespace TripService.Services
{
    public class ActivityService
    {
        private readonly AppDbContext _context;

        public ActivityService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ActivityResponseDto>> GetActivitiesByTrip(int tripId)
        {
            return await _context.Activities
                .Where(a =>  a.TripId == tripId)
                .Select(a => new ActivityResponseDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Date = a.Date,
                    Time = a.Time,
                    Location = a.Location,
                    Description = a.Description,
                    EstimatedCost = a.EstimatedCost,
                    Status = a.Status,
                    TripId = a.TripId
                })
                .ToListAsync();
        }

        public async Task<ActivityResponseDto> CreateActivity(CreateActivityDto dto)
        {
            var activity = new Activity
            {
                Name = dto.Name,
                Date = dto.Date,
                Time = dto.Time,
                Location = dto.Location,
                Description = dto.Description,
                EstimatedCost = dto.EstimatedCost,
                Status = dto.Status,
                TripId = dto.TripId
            };

            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();

            return new ActivityResponseDto
            {
                Id = activity.Id,
                Name = activity.Name,
                Date = activity.Date,
                Time = activity.Time,
                Location = activity.Location,
                Description = activity.Description,
                EstimatedCost = activity.EstimatedCost,
                Status = activity.Status,
                TripId = activity.TripId
            };
        }

        public async Task<ActivityResponseDto> UpdateActivity(int id, CreateActivityDto dto)
        {
            var activity = await _context.Activities.FindAsync(id);

            if (activity == null)
                throw new Exception("Activity not found");

            activity.Name = dto.Name;
            activity.Date = dto.Date;
            activity.Time = dto.Time;
            activity.Location = dto.Location;
            activity.Description = dto.Description;
            activity.EstimatedCost = dto.EstimatedCost;
            activity.Status = dto.Status;

            await _context.SaveChangesAsync();

            return new ActivityResponseDto
            {
                Id = activity.Id,
                Name = activity.Name,
                Date = activity.Date,
                Time = activity.Time,
                Location = activity.Location,
                Description = activity.Description,
                EstimatedCost = activity.EstimatedCost,
                Status = activity.Status,
                TripId = activity.TripId
            };
        }

        public async Task UpdateActivityStatus(int id, ActivityStatus status)
        {
            var activity = await _context.Activities.FindAsync(id);

            if (activity == null)
                throw new Exception("Activity not found");

            activity.Status = status;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteActivity(int id)
        {
            var activity = await _context.Activities.FindAsync(id);

            if (activity == null)
                throw new Exception("Activity not found");

            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();
        }
    }
}
