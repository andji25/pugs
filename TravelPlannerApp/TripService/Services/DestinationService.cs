using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.DTOs;
using TripService.Models;

namespace TripService.Services
{
    public class DestinationService
    {
        private readonly AppDbContext _context;

        public DestinationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DestinationResponseDto>> GetDestinationsByTrip(int tripId)
        {
            return await _context.Destinations
                .Where(d => d.TripId == tripId)
                .Select(d => new DestinationResponseDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Location = d.Location,
                    ArrivalDate = d.ArrivalDate,
                    DepartureDate = d.DepartureDate,
                    Description = d.Description,
                    Notes = d.Notes,
                    TripId = d.TripId
                })
                .ToListAsync();
        }

        public async Task<DestinationResponseDto> CreateDestination(CreateDestinationDto dto)
        {
            if (dto.DepartureDate < dto.ArrivalDate)
                throw new Exception("Departure date cannot be before arrival date");

            var destination = new Destination
            {
                Name = dto.Name,
                Location = dto.Location,
                ArrivalDate = dto.ArrivalDate,
                DepartureDate = dto.DepartureDate,
                Description = dto.Description,
                Notes = dto.Notes,
                TripId = dto.TripId
            };

            _context.Destinations.Add(destination);
            await _context.SaveChangesAsync();

            return new DestinationResponseDto 
            {
                Id = destination.Id,
                Name = destination.Name,
                Location = destination.Location,
                ArrivalDate = destination.ArrivalDate,
                DepartureDate = destination.DepartureDate,
                Description = destination.Description,
                Notes = destination.Notes,
                TripId = destination.TripId
            };
        }

        public async Task<DestinationResponseDto> UpdateDestination(int id, CreateDestinationDto dto)
        {
            var destination = await _context.Destinations.FindAsync(id);

            if (destination == null)
                throw new Exception("Destination not found");

            if (dto.DepartureDate < dto.ArrivalDate)
                throw new Exception("Departure date cannot be before arrival date");

            destination.Name = dto.Name;
            destination.Location = dto.Location;
            destination.ArrivalDate = dto.ArrivalDate;
            destination.DepartureDate = dto.DepartureDate;
            destination.Description = dto.Description;
            destination.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return new DestinationResponseDto 
            {
                Id = destination.Id,
                Name = destination.Name,
                Location = destination.Location,
                ArrivalDate = destination.ArrivalDate,
                DepartureDate = destination.DepartureDate,
                Description = destination.Description,
                Notes = destination.Notes,
                TripId = destination.TripId
            };
        }

        public async Task DeleteDestination(int id)
        {
            var destination = await _context.Destinations.FindAsync(id);

            if (destination == null)
                throw new Exception("Destination not found");

            _context.Destinations.Remove(destination);
            await _context.SaveChangesAsync();
        }
    }
}
