using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharingService.DTOs;
using SharingService.Services;

namespace SharingService.Controllers
{
    [ApiController]
    [Route("api/share-tokens")]
    public class ShareTokensController : ControllerBase
    {
        private readonly ShareTokenService _shareTokenService;

        public ShareTokensController(ShareTokenService shareTokenService)
        {
            _shareTokenService = shareTokenService;
        }

        [HttpGet("trip/{tripId}")]
        [Authorize]
        public async Task<IActionResult> GetByTrip(int tripId)
        {
            try
            {
                var tokens = await _shareTokenService.GetTokensByTrip(tripId);
                return Ok(tokens);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateShareTokenDto dto)
        {
            try
            {
                var token = await _shareTokenService.CreateShareToken(dto);
                return Ok(token);
            }
            catch (Exception ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("validate/{token}")]
        public async Task<IActionResult> Validate(string token)
        {
            try
            {
                var result = await _shareTokenService.ValidateToken(token);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/deactivate")]
        [Authorize]
        public async Task<IActionResult> Deactivate(int id)
        {
            try
            {
                await _shareTokenService.DeactivateToken(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        
    }
}
