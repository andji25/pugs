using Microsoft.EntityFrameworkCore;
using System.Text;
using UserService.Data;
using UserService.DTOs;
using UserService.Models;

namespace UserService.Services
{
    public class AdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserResponseDto>> GetUsers()
        {
            return await _context.Users
                    .Select(u => new UserResponseDto
                    {
                        Id = u.Id,
                        Name = u.Name,
                        Email = u.Email,
                        Role = u.Role
                    })
                    .ToListAsync();
        }

        public async Task DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                throw new Exception("User not found");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
