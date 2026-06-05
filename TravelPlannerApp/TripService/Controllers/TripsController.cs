using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TripService.DTOs;
using TripService.Services;

namespace TripService.Controllers
{
    [ApiController]
    [Route("api/trips")]
    [Authorize]
    public class TripsController : ControllerBase
    {
        private readonly TripManagementService _tripService;

        public TripsController(TripManagementService tripService)
        {
            _tripService = tripService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var trips = await _tripService.GetAllTrips(GetUserId());
                return Ok(trips);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var trip = await _tripService.GetTripById(id, GetUserId());
                return Ok(trip);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("public/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublic(int id)
        {
            try
            {
                var trip = await _tripService.GetTripByIdPublic(id);
                return Ok(trip);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTripDto dto)
        {
            try
            {
                var trip = await _tripService.CreateTrip(dto, GetUserId());
                return Ok(trip);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateTripDto dto)
        {
            try
            {
                var trip = await _tripService.UpdateTrip(id, dto, GetUserId());
                return Ok(trip);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _tripService.DeleteTrip(id, GetUserId());
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
