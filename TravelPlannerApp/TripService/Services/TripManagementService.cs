using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.DTOs;
using TripService.Models;


namespace TripService.Services
{
    public class TripManagementService
    {
        private readonly AppDbContext _context;

        public TripManagementService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TripResponseDto>> GetAllTrips(int userId)
        {
            return await _context.Trips
                .Where(t => t.UserId == userId)
                .Select(t => new TripResponseDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    StartDate = t.StartDate,
                    EndDate = t.EndDate,
                    Budget = t.Budget,
                    Notes = t.Notes,
                    UserId = t.UserId,
                    CreatedAt = t.CreatedAt,
                    TotalExpenses = t.Expenses.Sum(e => e.Amount) + t.Activities.Sum(a => a.EstimatedCost),
                    RemainingBudget = t.Budget - t.Expenses.Sum(e => e.Amount) - t.Activities.Sum(a => a.EstimatedCost)
                })
                .ToListAsync();
        }

        public async Task<TripResponseDto> GetTripById(int id, int userId)
        {
            var trip = await _context.Trips
                .Include(t => t.Expenses)
                .Include(t => t.Activities)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (trip == null)
                throw new Exception("Trip not found");

            return new TripResponseDto
            {
                Id = trip.Id,
                Name = trip.Name,
                Description = trip.Description,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                Budget = trip.Budget,
                Notes = trip.Notes,
                UserId = trip.UserId,
                CreatedAt = trip.CreatedAt,
                TotalExpenses = trip.Expenses.Sum(e => e.Amount) + trip.Activities.Sum(a => a.EstimatedCost),
                RemainingBudget = trip.Budget - trip.Expenses.Sum(e => e.Amount) - trip.Activities.Sum(a => a.EstimatedCost)
            };
        }

        public async Task<TripResponseDto> CreateTrip(CreateTripDto dto, int userId)
        {
            if (dto.EndDate < dto.StartDate)
                throw new Exception("End date cannot be before start date");

            if (dto.Budget < 0)
                throw new Exception("Budget cannot be negative");

            var trip = new Trip
            {
                Name = dto.Name,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Budget = dto.Budget,
                Notes = dto.Notes,
                UserId = userId,
            };

            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            return new TripResponseDto
            {
                Id = trip.Id,
                Name = trip.Name,
                Description = trip.Description,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                Budget = trip.Budget,
                Notes = trip.Notes,
                UserId = trip.UserId,
                CreatedAt = trip.CreatedAt,
                TotalExpenses = 0,
                RemainingBudget = trip.Budget
            };
        }

        public async Task<TripResponseDto> UpdateTrip(int id, UpdateTripDto dto, int userId)
        {
            var trip = await _context.Trips
                .Include(t => t.Expenses)
                .Include(t => t.Activities)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (trip == null)
                throw new Exception("Trip not found");

            if (dto.EndDate < dto.StartDate)
                throw new Exception("End date cannot be before start date");

            if (dto.Budget < 0)
                throw new Exception("Budget cannot be negative");

            trip.Name = dto.Name;
            trip.Description = dto.Description;
            trip.StartDate = dto.StartDate;
            trip.EndDate = dto.EndDate;
            trip.Budget = dto.Budget;
            trip.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return new TripResponseDto
            {
                Id = trip.Id,
                Name = trip.Name,
                Description = trip.Description,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                Budget = trip.Budget,
                Notes = trip.Notes,
                UserId = trip.UserId,
                CreatedAt = trip.CreatedAt,
                TotalExpenses = trip.Expenses.Sum(e => e.Amount) + trip.Activities.Sum(a => a.EstimatedCost),
                RemainingBudget = trip.Budget - trip.Expenses.Sum(e => e.Amount) - trip.Activities.Sum(a => a.EstimatedCost)
            };
        }

        public async Task DeleteTrip(int id, int userId)
        {
            var trip = await _context.Trips
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (trip == null)
                throw new Exception("Trip not found");

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();

        }
    }
}
