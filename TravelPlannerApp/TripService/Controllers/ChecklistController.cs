using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripService.DTOs;
using TripService.Services;

namespace TripService.Controllers
{
    [ApiController]
    [Route("api/checklist-items")]
    [Authorize]
    public class ChecklistController : ControllerBase
    {
        private readonly ChecklistService _checklistService;

        public ChecklistController(ChecklistService checklistService) {
            _checklistService = checklistService;
        }

        [HttpGet("trip/{tripId}")]
        public async Task<IActionResult> GetByTrip(int tripId)
        {
            try
            {
                var items = await _checklistService.GetChecklistByTrip(tripId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateChecklistItemDto dto)
        {
            try
            {
                var item = await _checklistService.CreateChecklistItem(dto);
                return Ok(item);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            try
            {
                var item = await _checklistService.ToggleChecklistItem(id);
                return Ok(item);
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
                await _checklistService.DeleteChecklistItem(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
