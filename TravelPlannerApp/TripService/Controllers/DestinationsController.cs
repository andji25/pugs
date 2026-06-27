using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripService.DTOs;
using TripService.Services;

namespace TripService.Controllers
{
    [ApiController]
    [Route("api/destinations")]
    [Authorize]
    public class DestinationsController : ControllerBase
    {
        private readonly DestinationService _destinationService;

        public DestinationsController(DestinationService destinationService)
        {
            _destinationService = destinationService;
        }

        [HttpGet("trip/{tripId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByTrip(int tripId)
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

        [HttpPost]
        public async Task<IActionResult> Create(CreateDestinationDto dto)
        {
            try
            {
                var destination = await _destinationService.CreateDestination(dto);
                return Ok(destination);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreateDestinationDto dto)
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

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
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
    }
}
