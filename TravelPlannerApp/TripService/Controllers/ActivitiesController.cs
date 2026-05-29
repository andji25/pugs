using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripService.DTOs;
using TripService.Enums;
using TripService.Services;

namespace TripService.Controllers
{
    [ApiController]
    [Route("api/activities")]
    [Authorize]
    public class ActivitiesController : ControllerBase
    {
        private readonly ActivityService _activityService;

        public ActivitiesController(ActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpGet("trip/{tripId}")]
        public async Task<IActionResult> GetByTrip(int tripId)
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

        [HttpPost]
        public async Task<IActionResult> Create(CreateActivityDto dto)
        {
            try
            {
                var activity = await _activityService.CreateActivity(dto);
                return Ok(activity);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreateActivityDto dto)
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

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] ActivityStatus status)
        {
            try
            {
                await _activityService.UpdateActivityStatus(id, status);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
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
