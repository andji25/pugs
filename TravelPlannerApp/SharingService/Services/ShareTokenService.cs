using Microsoft.EntityFrameworkCore;
using SharingService.Data;
using SharingService.DTOs;
using SharingService.Enums;
using SharingService.Models;
using System.Linq;

namespace SharingService.Services
{
    public class ShareTokenService
    {

        private readonly AppDbContext _context;

        public ShareTokenService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ShareTokenResponseDto>> GetTokensByTrip(int tripId)
        {
            return await _context.ShareTokens
                .Where(t => t.TripId == tripId)
                .Select(t => new ShareTokenResponseDto
                {
                    Id = t.Id,
                    Token = t.Token,
                    TripId = t.TripId,
                    AccessType = t.AccessType,
                    ExpiresAt = t.ExpiresAt,
                    IsActive = t.IsActive
                })
                .ToListAsync();
        }

        public async Task<ShareTokenResponseDto> CreateShareToken(CreateShareTokenDto dto)
        {
            var token = new ShareToken
            {
                Token = Guid.NewGuid().ToString("N"),
                TripId = dto.TripId,
                AccessType = dto.AccessType,
                ExpiresAt = DateTime.UtcNow.AddDays(dto.ExpiresInDays)
            };

            _context.ShareTokens.Add(token);
            await _context.SaveChangesAsync();

            return new ShareTokenResponseDto {
                Id = token.Id,
                Token = token.Token,
                TripId = token.TripId,
                AccessType = token.AccessType,
                ExpiresAt = token.ExpiresAt,
                IsActive = token.IsActive
            };
        }

        public async Task<ShareTokenResponseDto> ValidateToken(string token)
        {
            var shareToken = await _context.ShareTokens
                .FirstOrDefaultAsync(t => t.Token == token &&
                                          t.IsActive &&
                                          t.ExpiresAt > DateTime.UtcNow);

            if (shareToken == null)
                throw new Exception("Token is invalid or expired");

            return new ShareTokenResponseDto
            {
                Id = shareToken.Id,
                Token = shareToken.Token,
                TripId = shareToken.TripId,
                AccessType = shareToken.AccessType,
                ExpiresAt = shareToken.ExpiresAt,
                IsActive = shareToken.IsActive
            };
        }

        public async Task DeactivateToken(int id)
        {
            var token = await _context.ShareTokens.FindAsync(id);

            if (token == null)
                throw new Exception("Token not found");

            token.IsActive = false;
            await _context.SaveChangesAsync();
        }
    }
}
