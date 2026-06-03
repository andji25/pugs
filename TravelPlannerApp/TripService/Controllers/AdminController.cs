using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.DTOs;
using TripService.Services;

namespace TripService.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TripManagementService _tripService;
        
        public AdminController(AppDbContext context, TripManagementService tripService)
        {
            _context = context;
            _tripService = tripService;
        }

        [HttpGet("trips")]
        public async Task<IActionResult> GetAllTrips()
        {
            try
            {
                var trips = await _context.Trips
                    .Include(t => t.Expenses)
                    .Include(t => t.Activities)
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
                return Ok(trips);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("trips/{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            try
            {
                var trip = await _context.Trips.FindAsync(id);
                if (trip == null)
                    return NotFound(new { message = "Trip not found" });

                _context.Trips.Remove(trip);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
