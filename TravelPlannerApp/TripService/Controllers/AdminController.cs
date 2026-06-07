using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripService.DTOs;
using TripService.Services;

namespace TripService.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly TripManagementService _tripService;
        private readonly DestinationService _destinationService;
        private readonly ActivityService _activityService;

        public AdminController(TripManagementService tripService, DestinationService destinationService, ActivityService activityService)
        {
            _tripService = tripService;
            _destinationService = destinationService;
            _activityService = activityService;
        }

        [HttpGet("trips")]
        public async Task<IActionResult> GetAllTrips()
        {
            try
            {
                var trips = await _tripService.GetAllTripsAdmin();
                return Ok(trips);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("trips/{id}")]
        public async Task<IActionResult> GetTripById(int id)
        {
            try
            {
                var trip = await _tripService.GetTripByIdAdmin(id);
                return Ok(trip);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("trips/{id}")]
        public async Task<IActionResult> UpdateTrip(int id, UpdateTripDto dto)
        {
            try
            {
                var trip = await _tripService.UpdateTripAdmin(id, dto);
                return Ok(trip);
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
                await _tripService.DeleteTripAdmin(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("trips/user/{userId}")]
        public async Task<IActionResult> DeleteTripsByUser(int userId)
        {
            try
            {
                await _tripService.DeleteTripsByUserAdmin(userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("destinations/trip/{tripId}")]
        public async Task<IActionResult> GetDestinationsByTrip(int tripId)
        {
            try
            {
                var destinations = await _destinationService.GetDestinationsByTrip(tripId);
                return Ok(destinations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("destinations/{id}")]
        public async Task<IActionResult> UpdateDestination(int id, CreateDestinationDto dto)
        {
            try
            {
                var destination = await _destinationService.UpdateDestination(id, dto);
                return Ok(destination);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("destinations/{id}")]
        public async Task<IActionResult> DeleteDestination(int id)
        {
            try
            {
                await _destinationService.DeleteDestination(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("activities/trip/{tripId}")]
        public async Task<IActionResult> GetActivitiesByTrip(int tripId)
        {
            try
            {
                var activities = await _activityService.GetActivitiesByTrip(tripId);
                return Ok(activities);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("activities/{id}")]
        public async Task<IActionResult> UpdateActivity(int id, CreateActivityDto dto)
        {
            try
            {
                var activity = await _activityService.UpdateActivity(id, dto);
                return Ok(activity);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("activities/{id}")]
        public async Task<IActionResult> DeleteActivity(int id)
        {
            try
            {
                await _activityService.DeleteActivity(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
